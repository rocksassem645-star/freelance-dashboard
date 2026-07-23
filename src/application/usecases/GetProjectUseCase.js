class GetProjectsUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute() {
    return await this.projectRepository.findAll();
  }
}

module.exports = GetProjectsUseCase;