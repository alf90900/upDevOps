'use strict';

console.log('newrelic.js cargado correctamente');
console.log('License key:', process.env.NEW_RELIC_LICENSE_KEY);


exports.config = {
  app_name: ['APIS UP-devOps'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'debug'
  },
  distributed_tracing: {
    enabled: true
  }
}

