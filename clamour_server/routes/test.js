var express = require('express');
var router = express.Router();

let test = require('../controllers/test');

router.get('/', test.test_add_tag);

router.get('/db_tag_table', test.test_add_tag);

module.exports = router;