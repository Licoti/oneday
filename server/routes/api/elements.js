var express = require('express');
var router = express.Router();
const debug = process.env.NODE_ENV === 'dev';

const ElementCtrl = require('../../controllers/index');
const { Element } = require('../../../server/models');

router.post('/element/:user', ElementCtrl.createElement);
router.get('/elements/:user', ElementCtrl.getElements);
router.put('/element/:id', ElementCtrl.putElement);
router.delete('/element/:id', ElementCtrl.deleteElement);

module.exports = router;
