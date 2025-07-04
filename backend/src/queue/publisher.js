const { connectRabbitMQ } = require('../config/rabbitmq');

async function publish(queueName, message) {
  const conn = await connectRabbitMQ();
  const channel = await conn.createChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));

  console.log(`[x] Sent to ${queueName}:`, message);
}

module.exports = { publish };
