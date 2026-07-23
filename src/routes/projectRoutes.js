const express = require('express');
const projectController = require('../Controllers/ProjectController');
const authMiddleware = require('../infrastructure/middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', projectController.create.bind(projectController));
router.get('/', projectController.getByUser.bind(projectController));
router.get('/:id', projectController.getById.bind(projectController));
router.get('/client/:clientId', projectController.getByClient.bind(projectController));
router.put('/:id', projectController.update.bind(projectController));
router.delete('/:id', projectController.delete.bind(projectController));

module.exports = router;