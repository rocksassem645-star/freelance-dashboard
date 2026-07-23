class Project {
  constructor(
    id,
    userId,
    clientId,
    title,
    description,
    status,
    startDate,
    endDate,
    budget,
    createdAt,
  ) {
    this.id = id;
    this.userId = userId;
    this.clientId = clientId;
    this.title = title;
    this.description = description;
    this.status = status || 'active';
    this.startDate = startDate;
    this.endDate = endDate;
    this.budget = budget;
    this.createdAt = createdAt || new Date();
  }

  static create(
    userId,
    clientId,
    title,
    description,
    startDate,
    endDate,
    budget,
  ) {
    return new Project(
      null,
      userId,
      clientId,
      title,
      description,
      'active',
      startDate,
      endDate,
      budget,
      new Date(),
    );
  }

  validate() {
    if (!this.userId || !this.clientId || !this.title) {
      throw new Error('User ID, Client ID, and Title are required!');
    }
    if (this.budget && this.budget <= 0) {
      throw new Error('Budget must be greater than 0!');
    }
    return true;
  }

  toDatabase() {
    return {
      user_id: this.userId,
      client_id: this.clientId,
      title: this.title,
      description: this.description,
      status: this.status,
      start_date: this.startDate,
      end_date: this.endDate,
      budget: this.budget,
      created_at: this.createdAt,
    };
  }

  static fromDatabase(data) {
    return new Project(
      data.id,
      data.user_id,
      data.client_id,
      data.title,
      data.description,
      data.status,
      data.start_date,
      data.end_date,
      data.budget,
      data.created_at,
    );
  }
}

module.exports = Project;