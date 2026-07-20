const express = require('express');
const router = express.Router();
const Joi = require('joi');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Import repositories
const ClientRepository = require('../infrastructure/repositories/ClientRepository');

// Import usecases
const CreateClientUseCase = require('../application/usecases/CreateClientUseCase');
const GetClientsUseCase = require('../application/usecases/GetClientsUseCase');
const UpdateClientUseCase = require('../application/usecases/UpdateClientUseCase');
const DeleteClientUseCase = require('../application/usecases/DeleteClientUseCase');

// Import auth middleware
const authMiddleware = require('../infrastructure/middleware/authMiddleware');
const logger = require('../infrastructure/logger');

// Middleware
router.use(cookieParser());
const csrfProtection = csrf({ cookie: true });

// Initialize repository
const clientRepository = new ClientRepository();

// Validation schema
const clientSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).required(),
  address: Joi.string().max(255),
  country: Joi.string().length(2).uppercase().required(),
  company: Joi.string().max(100),
  industry: Joi.string().max(50),
  rate: Joi.number().positive().max(999999),
}).unknown(false);

const validateSchema = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ errors: messages });
  }

  req.validatedBody = value;
  next();
};

// Pagination middleware
const validatePagination = (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;

  // Validate ranges
  page = Math.max(1, page);
  limit = Math.min(Math.max(1, limit), 100);  // 1-100 items max

  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
};

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================

// GET /api/clients - Get all clients (with pagination)
router.get('/', authMiddleware, validatePagination, async (req, res) => {
  try {
    const { page, limit, offset } = req.pagination;
    
    const getClients = new GetClientsUseCase(clientRepository);
    const result = await getClients.execute(req.user.id, limit, offset);

    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });

    logger.info(`Retrieved clients for user ${req.user.id}`);
  } catch (error) {
    logger.error(`Error getting clients: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/clients/search - Search clients
router.get('/search', authMiddleware, validatePagination, async (req, res) => {
  try {
    const { q } = req.query;
    const { page, limit, offset } = req.pagination;

    if (!q) {
      const getClients = new GetClientsUseCase(clientRepository);
      const result = await getClients.execute(req.user.id, limit, offset);
      return res.json({
        data: result.data,
        pagination: {
          total: result.total,
          page,
          limit,
          pages: Math.ceil(result.total / limit)
        }
      });
    }

    // Validate search term length
    if (q.length > 100) {
      return res.status(400).json({ error: "Search term too long (max 100 characters)" });
    }

    const result = await clientRepository.search(req.user.id, q, limit, offset);
    
    res.json({
      data: result.data,
      pagination: {
        total: result.total,
        page,
        limit,
        pages: Math.ceil(result.total / limit)
      }
    });

    logger.info(`Searched clients for user ${req.user.id}: "${q}"`);
  } catch (error) {
    logger.error(`Error searching clients: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// GET /api/clients/:id - Get a single client
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (!Number.isInteger(clientId) || clientId <= 0) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const client = await clientRepository.findById(clientId, req.user.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    logger.error(`Error getting client: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/clients - Create a new client
router.post('/', authMiddleware, csrfProtection, validateSchema(clientSchema), async (req, res) => {
  try {
    const createClient = new CreateClientUseCase(clientRepository);
    const client = await createClient.execute(req.user.id, req.validatedBody);

    res.status(201).json(client);
    
    logger.info(`Created client for user ${req.user.id}: ${req.validatedBody.email}`);
  } catch (error) {
    logger.error(`Error creating client: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/clients/:id - Update a client
router.put('/:id', authMiddleware, csrfProtection, validateSchema(clientSchema), async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (!Number.isInteger(clientId) || clientId <= 0) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const updateClient = new UpdateClientUseCase(clientRepository);
    const client = await updateClient.execute(clientId, req.user.id, req.validatedBody);

    res.json(client);
    
    logger.info(`Updated client ${clientId} for user ${req.user.id}`);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }

    logger.error(`Error updating client: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/clients/:id - Delete a client
router.delete('/:id', authMiddleware, csrfProtection, async (req, res) => {
  try {
    const clientId = parseInt(req.params.id);
    
    if (!Number.isInteger(clientId) || clientId <= 0) {
      return res.status(400).json({ error: "Invalid client ID" });
    }

    const deleteClient = new DeleteClientUseCase(clientRepository);
    await deleteClient.execute(clientId, req.user.id);

    res.json({ message: 'Client deleted successfully' });
    
    logger.info(`Deleted client ${clientId} for user ${req.user.id}`);
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: error.message });
    }

    logger.error(`Error deleting client: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;