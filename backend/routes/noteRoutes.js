const express = require('express');

const noteController = require('../controllers/noteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', noteController.create);
router.get('/', noteController.getAll);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.deleteData);

module.exports = router;