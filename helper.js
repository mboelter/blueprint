var basicAuth = require('basic-auth');

module.exports.slug = function(s) {
  return s.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
};

// from http://www.danielstjules.com/2014/08/03/basic-auth-with-express-4/
module.exports.basicAuth = function(username, password) {
  return function(req, res, next) {
    var user = basicAuth(req);

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    }

    next();
  };
};