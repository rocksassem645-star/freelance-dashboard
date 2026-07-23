class Invoice {
  constructor(
    id,
    userId,
    clientId,
    projectId,
    invoiceNumber,
    amount,
    status,
    issueDate,
    dueDate,
    description,
    paidDate,
    createdAt,
  ) {
    this.id = id;
    this.userId = userId;
    this.clientId = clientId;
    this.projectId = projectId;
    this.invoiceNumber = invoiceNumber;
    this.amount = amount;
    this.status = status || 'draft';
    this.issueDate = issueDate;
    this.dueDate = dueDate;
    this.description = description;
    this.paidDate = paidDate;
    this.createdAt = createdAt || new Date();
  }

  static create(
    userId,
    clientId,
    projectId,
    invoiceNumber,
    amount,
    issueDate,
    dueDate,
    description,
  ) {
    return new Invoice(
      null,
      userId,
      clientId,
      projectId,
      invoiceNumber,
      amount,
      'draft',
      issueDate,
      dueDate,
      description,
      null,
      new Date(),
    );
  }

  validate() {
    if (!this.userId || !this.clientId || !this.amount) {
      throw new Error('User ID, Client ID, and Amount are required!');
    }
    if (this.amount <= 0) {
      throw new Error('Amount must be greater than 0!');
    }
    return true;
  }

  toDatabase() {
    return {
      user_id: this.userId,
      client_id: this.clientId,
      project_id: this.projectId,
      invoice_number: this.invoiceNumber,
      amount: this.amount,
      status: this.status,
      issue_date: this.issueDate,
      due_date: this.dueDate,
      description: this.description,
      paid_date: this.paidDate,
      created_at: this.createdAt,
    };
  }

  static fromDatabase(data) {
    return new Invoice(
      data.id,
      data.user_id,
      data.client_id,
      data.project_id,
      data.invoice_number,
      data.amount,
      data.status,
      data.issue_date,
      data.due_date,
      data.description,
      data.paid_date,
      data.created_at,
    );
  }
}

module.exports = Invoice;