var express = require('express');
var router = express.Router();

let landing = require('../controllers/landing');
let test = require('../controllers/test');

/* GET home page. */
router.get('/', landing.get_lead);
router.post('/', landing.submit_lead);

router.get('/test_insert_tag', test.test_add_tag);

module.exports = router;
