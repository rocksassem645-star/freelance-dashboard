const express = require('express');
const invoiceController = require('../Controllers/InvoiceController');
const authMiddleware = require('../infrastructure/middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', invoiceController.create.bind(invoiceController));
router.get('/', invoiceController.getByUser.bind(invoiceController));
router.get('/:id', invoiceController.getById.bind(invoiceController));
router.get('/client/:clientId', invoiceController.getByClient.bind(invoiceController));
router.put('/:id', invoiceController.update.bind(invoiceController));
router.delete('/:id', invoiceController.delete.bind(invoiceController));

module.exports = router;