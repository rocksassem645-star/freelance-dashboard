// server/src/application/usecases/UpdateClientUseCase.js
const Client = require('../../core/entities/Client');  // ← Capital C!

class UpdateClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    async execute(id, userId, clientData) {
        const existingClient = await this.clientRepository.findById(id);
        if (!existingClient) {
            throw new Error('Client not found');
        }
        if (existingClient.userId !== userId) {
            throw new Error('Unauthorized');
        }

        const client = Client.create(  // ← Capital C!
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
        client.id = id;
        client.validate();

        await this.clientRepository.update(id, clientData);
        return { ...client, id };
    }
}

module.exports = UpdateClientUseCase;