var express = require('express');
var router = express.Router();

let setup = require('../controllers/setup/setup')

/* GET users listing. */
router.get('/', setup.render_page);

module.exports = router;
