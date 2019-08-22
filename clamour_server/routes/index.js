var express = require('express');
var router = express.Router();

let index = require('../controllers/index');
let rest = require('../controllers/rest')

/* GET home page. */
router.get('/', index.index);
router.post('/', index.index);

// REST API
router.get('/tags', rest.get_all_tags);
router.post('/tags', rest.create_tag);
router.delete('/tags', rest.delete_all_tags);

router.get('/tags/:tag_id', rest.get_tag);
router.put('/tags/:tag_id', rest.update_tag);
router.delete('/tags/:tag_id', rest.delete_tag);

module.exports = router;
