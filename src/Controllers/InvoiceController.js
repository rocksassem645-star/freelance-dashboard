const createInvoiceUseCase = require('../application/usecases/CreateInvoiceUseCase');
const getInvoiceUseCase = require('../application/usecases/GetInvoiceUseCase');
const updateInvoiceUseCase = require('../application/usecases/UpdateInvoiceUseCase');
const deleteInvoiceUseCase = require('../application/usecases/DeleteInvoiceUseCase');

class InvoiceController {
  async create(req, res) {
    try {
      const { clientId, projectId, invoiceNumber, amount, issueDate, dueDate, description } =
        req.body;
      const userId = req.user.id;

      const invoice = await createInvoiceUseCase.execute(
        userId,
        clientId,
        projectId,
        invoiceNumber,
        amount,
        issueDate,
        dueDate,
        description,
      );

      res.status(201).json({ message: 'Invoice created', invoice });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const invoice = await getInvoiceUseCase.execute(id);

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByUser(req, res) {
    try {
      const userId = req.user.id;
      const invoices = await getInvoiceUseCase.getByUser(userId);
      res.json(invoices);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const invoices = await getInvoiceUseCase.getByClient(clientId);
      res.json(invoices);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const invoice = await updateInvoiceUseCase.execute(id, updates);
      res.json({ message: 'Invoice updated', invoice });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await deleteInvoiceUseCase.execute(id);
      res.json({ message: 'Invoice deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new InvoiceController();