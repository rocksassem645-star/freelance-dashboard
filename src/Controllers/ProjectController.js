const createProjectUseCase = require('../application/usecases/CreateProjectUseCase');
const getProjectUseCase = require('../application/usecases/GetProjectUseCase');
const updateProjectUseCase = require('../application/usecases/UpdateProjectUseCase');
const deleteProjectUseCase = require('../application/usecases/DeleteProjectUseCase');

class ProjectController {
  async create(req, res) {
    try {
      const { clientId, title, description, startDate, endDate, budget } = req.body;
      const userId = req.user.id;

      const project = await createProjectUseCase.execute(
        userId,
        clientId,
        title,
        description,
        startDate,
        endDate,
        budget,
      );

      res.status(201).json({ message: 'Project created', project });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const project = await getProjectUseCase.execute(id);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByUser(req, res) {
    try {
      const userId = req.user.id;
      const projects = await getProjectUseCase.getByUser(userId);
      res.json(projects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getByClient(req, res) {
    try {
      const { clientId } = req.params;
      const projects = await getProjectUseCase.getByClient(clientId);
      res.json(projects);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const project = await updateProjectUseCase.execute(id, updates);
      res.json({ message: 'Project updated', project });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await deleteProjectUseCase.execute(id);
      res.json({ message: 'Project deleted' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProjectController();