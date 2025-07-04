class User {
  constructor({ employee_id, name, email, phone, photo, is_admin, position, status, password }) {
    this.employeeId = employee_id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.photo = photo;
    this.isAdmin = is_admin; 
    this.position = position;
    this.status = status;
    this.password = password;
  }

  toJSON() {
    return {
      employeeId: this.employeeId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      photo: this.photo,
      isAdmin: this.isAdmin,
      position: this.position,
      status: this.status
    };
  }
}

module.exports = User;
