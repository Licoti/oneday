var express = require('express');
var router = express.Router();

const ctrl = require('../../controllers/index');

//Element
router.post('/element/:user', ctrl.createElement);
router.get('/elements/:user', ctrl.getElements);
router.put('/element/:id', ctrl.putElement);
router.delete('/element/:id', ctrl.deleteElement);

//User
router.post('/user', ctrl.createUser);

module.exports = router;
