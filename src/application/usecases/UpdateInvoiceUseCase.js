const Invoice = require('../../core/entities/Invoice');
const invoiceRepository = require('../../infrastructure/repositories/InvoiceRepository');

class UpdateInvoiceUseCase {
  async execute(id, updates) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new Error('Invoice not found');

    Object.assign(invoice, updates);
    invoice.validate();
    return invoiceRepository.update(invoice);
  }
}

module.exports = new UpdateInvoiceUseCase();