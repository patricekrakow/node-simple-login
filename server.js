// node-simple-login
var express    = require('express');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt        = require('jsonwebtoken');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressJWT({ secret: "My Secret!" }).unless({ path: ['/login']}));

var router = express.Router();

router.route('/login')
  .post(function(req, res) {
    if (!req.body.username) {
      res.status(401).json( { error: "username required" } );
      return;
    }
    if (!req.body.password) {
      res.status(401).json( { error: "password required" } );
      return;
    }
    if (req.body.username == "John" && req.body.password == "secret") {
      var myToken = jwt.sign({ username: req.body.username }, 'My Secret!');
      res.status(200).json( { token: myToken } );
    } else {
      res.status(401).json( { error: "invalid username and/or password" } );
    }
  });

router.route('/hello')
  .get(function(req, res) {
    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        var token = parts[1];
      }
    }
    jwt.verify(token, 'My Secret!', function(err, decoded) {
      if (err) throw(err);
      res.status(200).json( { message: 'Hello ' + decoded.username + "!"} );
    });
  });

app.use('/', router);

app.listen(process.env.PORT, process.env.IP);
console.log('Server running at ' +
  process.env.IP + ':' + process.env.PORT + '...');
