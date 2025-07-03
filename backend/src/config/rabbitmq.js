const amqp = require('amqplib');

let connection;

async function connectRabbitMQ() {
  if (connection) return connection;

  const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
  connection = await amqp.connect(url);
  console.log(`✅ RabbitMQ connected to ${url}`);
  return connection;
}

module.exports = { connectRabbitMQ };
