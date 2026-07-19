// server/src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();

// Import repositories
const ClientRepository = require('../infrastructure/repositories/ClientRepository');

// Import usecases
const CreateClientUseCase = require('../application/usecases/CreateClientUseCase');
const GetClientsUseCase = require('../application/usecases/GetClientsUseCase');
const UpdateClientUseCase = require('../application/usecases/UpdateClientUseCase');
const DeleteClientUseCase = require('../application/usecases/DeleteClientUseCase');

// Import auth middleware
const authMiddleware = require('../infrastructure/middleware/authMiddleware');

// Initialize repository
const clientRepository = new ClientRepository();

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================

// GET /api/clients - Get all clients for the logged-in user
router.get('/', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const getClients = new GetClientsUseCase(clientRepository);
    const clients = await getClients.execute(req.user.id);
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/clients/search?q=term - Search clients
router.get('/search', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const { q } = req.query;
    if (!q) {
      const getClients = new GetClientsUseCase(clientRepository);
      const clients = await getClients.execute(req.user.id);
      return res.json(clients);
    }
    const clients = await clientRepository.search(req.user.id, q);
    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/clients/:id - Get a single client
router.get('/:id', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const client = await clientRepository.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    if (client.userId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/clients - Create a new client
router.post('/', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const createClient = new CreateClientUseCase(clientRepository);
    const client = await createClient.execute(req.user.id, req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/clients/:id - Update a client
router.put('/:id', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const updateClient = new UpdateClientUseCase(clientRepository);
    const client = await updateClient.execute(req.params.id, req.user.id, req.body);
    res.json(client);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/clients/:id - Delete a client
router.delete('/:id', authMiddleware, async (req, res) => {  // ← FIXED: req, res
  try {
    const deleteClient = new DeleteClientUseCase(clientRepository);
    await deleteClient.execute(req.params.id, req.user.id);
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;