class Client {
  constructor(
    id,
    userId,
    name,
    email,
    phone,
    address,
    country,
    company,
    industry,
    rate,
    createdAt,
    updatedAt,
  ) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.country = country;
    this.company = company;
    this.industry = industry;
    this.rate = rate;
    this.createdAt = createdAt || new Date();
  }

  static create(
    userId,
    name,
    email,
    phone,
    address,
    country,
    company,
    industry,
    rate,
  ) {
    return new Client(
      null,
      userId,
      name,
      email,
      phone,
      address,
      country,
      company,
      industry,
      rate,
      new Date(),
    );
  }

  validate(){ 
    if (!this.name || !this.email || !this.userId) {
      throw new Error("Name , Email & Userid are required!");
    }
    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(this.email)){ 
      throw new Error("Invalid email Format!");
    }
    return true;
  }

  //convert to database format
  toDatabase(){ 
         return {
            user_id: this.userId,
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address,
            country: this.country,
            company: this.company,
            industry: this.industry,
            rate: this.rate,
            created_at: this.createdAt
        };
  }
    // Convert from database format
    static fromDatabase(data) {
        return new Client(
            data.id,
            data.user_id,
            data.name,
            data.email,
            data.phone,
            data.address,
            data.country,
            data.company,
            data.industry,
            data.rate,
            data.created_at
        );
    }
}

module.exports = Client;
