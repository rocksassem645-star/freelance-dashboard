// server/src/application/usecases/DeleteClientUseCase.js
class DeleteClientUseCase {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async execute(id, userId) {
    // Check if client exists and belongs to user
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }
    if (client.userId !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Delete from database
    return await this.clientRepository.delete(id);
  }
}

module.exports = DeleteClientUseCase;