// server/src/application/usecases/GetClientsUseCase.js
class GetClientsUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(userId) {
    return await this.clientRepository.findByUserId(userId);
  }
}

module.exports = GetClientsUseCase;