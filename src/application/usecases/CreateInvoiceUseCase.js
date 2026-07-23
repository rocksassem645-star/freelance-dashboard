const Invoice = require('../../core/entities/Invoice');
const invoiceRepository = require('../../core/repositories/InvoiceRepository');

class CreateInvoiceUseCase {
  async execute(
    userId,
    clientId,
    projectId,
    invoiceNumber,
    amount,
    issueDate,
    dueDate,
    description,
  ) {
    const invoice = Invoice.create(
      userId,
      clientId,
      projectId,
      invoiceNumber,
      amount,
      issueDate,
      dueDate,
      description,
    );

    invoice.validate();
    return invoiceRepository.create(invoice);
  }
}

module.exports = new CreateInvoiceUseCase();