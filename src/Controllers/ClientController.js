const GetClientsUseCase = require('../application/usecases/GetClientsUseCase');
const CreateClientUseCase = require('../application/usecases/CreateClientUseCase');
const UpdateClientUseCase = require('../application/usecases/UpdateClientUseCase');
const DeleteClientUseCase = require('../application/usecases/DeleteClientUseCase');

class ClientController {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  async getAll(req, res) {
    try {
      const useCase = new GetClientsUseCase(this.clientRepository);
      const clients = await useCase.execute();
      res.json({ success: true, data: clients });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const useCase = new CreateClientUseCase(this.clientRepository);
      const client = await useCase.execute(req.body);
      res.status(201).json({ success: true, data: client });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const useCase = new UpdateClientUseCase(this.clientRepository);
      const client = await useCase.execute(req.params.id, req.body);
      res.json({ success: true, data: client });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const useCase = new DeleteClientUseCase(this.clientRepository);
      await useCase.execute(req.params.id);
      res.json({ success: true, message: 'Client deleted' });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

module.exports = ClientController;