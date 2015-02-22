var bunyan = require('bunyan');
var log;
module.exports = function() {
  if(!log) {
    log = bunyan.createLogger({
      name: 'myapp',
      streams: [
        {
          level: 'info',
          stream: process.stdout   
        }
      ]
    });    
  }
  return log;
};
