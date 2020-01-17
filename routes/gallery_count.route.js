const express = require('express');
const router = express.Router();

const gallery_count_controller = require('../controllers/gallery_count.controller');
//

router.post('/create', gallery_count_controller.gallery_count_create);
// router.post('/create', upload.single("slideFileInput"), gallery_count_controller.gallery_count_create);
router.get('/find', gallery_count_controller.gallery_count_all);
// router.get('/:id', gallery_count_controller.gallery_count_details);
router.put('/:id/update', gallery_count_controller.gallery_count_update);
// router.delete('/:id/delete', gallery_count_controller.gallery_count_delete);


module.exports = router;
