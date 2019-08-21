var express = require('express');
var router = express.Router();

let test = require('../controllers/test');

router.get('/', test.test_tag_queries);

router.get('/db_tags_table', test.test_tag_queries);
router.get('/db_visits_table', test.test_visits_queries);

module.exports = router;