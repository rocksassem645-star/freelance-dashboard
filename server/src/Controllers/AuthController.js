
const express = require('express');
const ClientController = require('../controllers/ClientController');
const ClientRepository = require('../infrastructure/repositories/ClientRepository');

const router = express.Router();
const clientRepo = new ClientRepository();
const clientController = new ClientController(clientRepo);

router.get('/', (req, res) => clientController.getAll(req, res));
router.post('/', (req, res) => clientController.create(req, res));
router.put('/:id', (req, res) => clientController.update(req, res));
router.delete('/:id', (req, res) => clientController.delete(req, res));

module.exports = router;