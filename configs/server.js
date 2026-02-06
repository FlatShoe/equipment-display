'use strict'

const BASEPORT = '9599'
const os = require('os')

const getLocalHosts = () => {
  const interfaces = os.networkInterfaces()
  const results = new Set()
  for (const _interface of Object.values(interfaces)) {
    if (_interface) {
      for (const config of _interface) {
        results.add(config.address)
      }
    }
  }
  const ip = [...results].find(item => item.indexOf('192.168') > -1)
  return ip || '0.0.0.0'
}

const devServer = {
  port: (() => {
    const port = require('portfinder-sync').getPort(BASEPORT)
    return port
  })(),
  host: '0.0.0.0',
  hot: true,
  compress: true,
  client: {
    overlay: {
      warnings: true,
      errors: true
    }
  }
}

module.exports = {
  devServer,
  getLocalHosts
}