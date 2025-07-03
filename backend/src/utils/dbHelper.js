exports.buildUpdateQuery = (table, data, whereField, whereValue) => {
  const keys = Object.keys(data).filter(key => data[key] !== undefined && data[key] !== null);

  if (keys.length === 0) {
    throw new Error('No fields to update');
  }

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  const values = keys.map(key => data[key]);
  values.push(whereValue);

  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereField} = $${keys.length + 1} RETURNING *`;

  return { query, values };
};