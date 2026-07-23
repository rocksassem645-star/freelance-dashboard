const invoiceRepository = require('../../core/repositories/InvoiceRepository');

class GetInvoiceUseCase {
  async execute(id) {
    return invoiceRepository.findById(id);
  }

  async getByUser(userId) {
    return invoiceRepository.findByUserId(userId);
  }

  async getByClient(clientId) {
    return invoiceRepository.findByClientId(clientId);
  }
}

module.exports = new GetInvoiceUseCase();