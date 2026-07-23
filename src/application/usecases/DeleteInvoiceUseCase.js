const invoiceRepository = require('../../core/repositories/InvoiceRepository');

class DeleteInvoiceUseCase {
  async execute(id) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new Error('Invoice not found');
    return invoiceRepository.delete(id);
  }
}

module.exports = new DeleteInvoiceUseCase();