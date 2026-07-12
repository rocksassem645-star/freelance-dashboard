class User {
  constructor(id, name, email, passwordHash, country, createdAt) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.country = country;
    this.createdAt = createdAt;
  }

  // Remove password from response
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      country: this.country,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
