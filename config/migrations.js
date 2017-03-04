// npm install mongoose-migrate -g

var path = require('path');

process.env.NODE_CONFIG_DIR = path.join(__dirname, '/environment');

require('dotenv').load({
  path: path.resolve(__dirname,'../.env')
});

require('./winston')();

module.exports = {
  local: {
    schema: { 'migration': {} },
    modelName: 'Migration',
    db: process.env.MONGODB_URL || 'mongodb://localhost/tajawal_com_dev'
  }
};
