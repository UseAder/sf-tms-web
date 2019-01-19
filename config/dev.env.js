'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MS_SERVER_URL:'"http://127.0.0.1:8605/stomp_server"'
})
