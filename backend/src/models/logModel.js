class Logs {
  constructor({employee_id, old_value, new_value, changed_field, updated_at }) {
    this.employeeId = employee_id
    this.oldValue = old_value;
    this.newValue = new_value;
    this.changedField = changed_field;
    this.updatedAt = updated_at;
  }

  toJSON() {
    return {
      employeeId: this.employeeId,
      oldValue: this.oldValue,
      newValue: this.newValue,
      changedField: this.changedField,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Logs;
