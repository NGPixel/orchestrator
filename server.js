'use strict'
// ===========================================
// Orchestrator
// 1.0.0
// Licensed under GPLv3
// ===========================================

global.ROOTPATH = __dirname
global.IS_DEBUG = process.env.NODE_ENV === 'development'
if (IS_DEBUG) {
  global.CORE_PATH = ROOTPATH + '/../core/'
} else {
  global.CORE_PATH = ROOTPATH + '/node_modules/requarks-core/'
}

// ----------------------------------------
// Load Winston
// ----------------------------------------

global.winston = require(CORE_PATH + 'core-libs/winston')(IS_DEBUG)
winston.info('Orchestrator Server is initializing...')

// ----------------------------------------
// Load global modules
// ----------------------------------------

let appconf = require(CORE_PATH + 'core-libs/config')()
global.appconfig = appconf.config
global.appdata = appconf.data
global.db = require('./libs/rethinkdb').init()
global.devices = require('./libs/devices').init()
global.lang = require('i18next')

// ----------------------------------------
// Load modules
// ----------------------------------------

const autoload = require('auto-load')
const bodyParser = require('body-parser')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const express = require('express')
// const favicon = require('serve-favicon')
const flash = require('connect-flash')
const http = require('http')
const i18nextBackend = require('i18next-node-fs-backend')
const i18nextMw = require('i18next-express-middleware')
const passport = require('passport')
const path = require('path')
const session = require('express-session')
const SessionRethinkdbStore = require('session-rethinkdb')(session)

var mw = autoload(CORE_PATH + '/core-middlewares')
var ctrl = autoload(path.join(ROOTPATH, '/controllers'))

// ----------------------------------------
// Define Express App
// ----------------------------------------

global.app = express()
app.use(compression())

// ----------------------------------------
// Public Assets
// ----------------------------------------

// app.use(favicon(path.join(ROOTPATH, 'assets', 'favicon.ico')))
app.use(express.static(path.join(ROOTPATH, 'assets')))

// ----------------------------------------
// Security
// ----------------------------------------

app.use(mw.security)

// ----------------------------------------
// Passport Authentication
// ----------------------------------------

require('./libs/auth')(passport)

app.use(cookieParser())
app.use(session({
  name: 'orchestrator.sid',
  store: new SessionRethinkdbStore(db.r),
  secret: appconfig.sessionSecret,
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// ----------------------------------------
// Localization Engine
// ----------------------------------------

lang
  .use(i18nextBackend)
  .use(i18nextMw.LanguageDetector)
  .init({
    load: 'languageOnly',
    ns: ['common', 'auth'],
    defaultNS: 'common',
    saveMissing: false,
    supportedLngs: ['en'],
    preload: ['en'],
    fallbackLng: 'en',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    }
  })

// ----------------------------------------
// View Engine Setup
// ----------------------------------------

app.use(i18nextMw.handle(lang))
app.set('views', path.join(ROOTPATH, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// ----------------------------------------
// View accessible data
// ----------------------------------------

app.locals._ = require('lodash')
app.locals.moment = require('moment')
app.locals.appconfig = appconfig
app.use(mw.flash)

// ----------------------------------------
// Controllers
// ----------------------------------------

app.use('/', ctrl.auth)

app.use('/', mw.auth, ctrl.dashboard)
app.use('/lights', mw.auth, ctrl.lights)
app.use('/bridges', mw.auth, ctrl.bridges)

app.use('/api/bridges', mw.auth, ctrl.api.bridges)

// ----------------------------------------
// Error handling
// ----------------------------------------

app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: IS_DEBUG ? err : {}
  })
})

// ----------------------------------------
// Start HTTP server
// ----------------------------------------

winston.info('Starting server on port ' + appconfig.port + '...')

app.set('port', appconfig.port)
var server = http.createServer(app)

server.listen(appconfig.port)
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Listening on port ' + appconfig.port + ' requires elevated privileges!')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error('Port ' + appconfig.port + ' is already in use!')
      process.exit(1)
      break
    default:
      throw error
  }
})

server.on('listening', () => {
  winston.info('Server started successfully! [RUNNING]')
})
