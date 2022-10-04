var express = require('express');
var router = express.Router();

const ElementCtrl = require('../../controllers/index');

router.post('/element/:user', ElementCtrl.createElement);
router.get('/elements/:user', ElementCtrl.getElements);
router.put('/element/:id', ElementCtrl.putElement);
router.delete('/element/:id', ElementCtrl.deleteElement);

module.exports = router;
