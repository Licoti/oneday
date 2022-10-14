var express = require('express');
var router = express.Router();

const json = require('../../../dist/manifest.json');

const indexJSFile = json['index.js'];
const appCSSFile = json['app.css'];

/* GET home page. */
router.get('/:id/:user', function(req, res, next) {
  res.render('detail', {
    title: 'Detail !',
    appJSFile: indexJSFile,
    appCSSFile: appCSSFile,
  });
});

module.exports = router;
