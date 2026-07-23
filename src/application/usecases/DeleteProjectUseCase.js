class DeleteProjectUseCase {
  constructor(projectRepository) {
    this.projectRepository = projectRepository;
  }

  async execute(id) {
    return await this.projectRepository.delete(id);
  }
}

module.exports = DeleteProjectUseCase;