const client = require('../../core/entities/Client');

class CreateClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(userId, clientData)   { 
          // Create client entity
    const client = Client.create(
      userId,
      clientData.name,
      clientData.email,
      clientData.phone,
      clientData.address,
      clientData.country,
      clientData.company,
      clientData.industry,
      clientData.rate
    );

        // Validate
    client.validate();

    // Save to database
    const id = await this.clientRepository.create(client);
    
    return { ...client, id };
  
    }
}
module.exports = CreateClientUseCase;