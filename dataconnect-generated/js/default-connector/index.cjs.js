const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'nuxt-boilerplate',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;
