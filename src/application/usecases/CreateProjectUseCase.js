class CreateProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(projectData) {
    return await this.projectRepository.create(projectData);
  }
}

module.exports = CreateProjectUseCase;