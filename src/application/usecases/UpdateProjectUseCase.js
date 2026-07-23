class UpdateProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id, projectData) {
    return await this.projectRepository.update(id, projectData);
  }
}

module.exports = UpdateProjectUseCase;