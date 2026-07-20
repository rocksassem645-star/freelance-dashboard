// server/src/application/usecases/CreateClientUseCase.js
const Client = require('../../core/entities/Client');  // ← Capital C for the CLASS!

class CreateClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(userId, clientData) {
        // Create client entity - use capital 'Client' for the class
        const client = Client.create(  // ← 'Client' is the class, 'client' is the instance
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