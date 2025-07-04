class Attendance {
  constructor({ id, employee_id, date, in_time, out_time, name, email }) {
    this.id = id;
    this.employeeId = employee_id; 
    this.date = date;
    this.clockIn = in_time;
    this.clockOut = out_time;
    this.name = name || null;
    this.email = email || null;
  }

  toJSON() {
    return {
      employeeId: this.employeeId,
      date: this.date,
      clockIn: this.clockIn,
      clockOut: this.clockOut,
      name: this.name,
      email: this.email
    };
  }
}

module.exports = Attendance;
