const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  console.log('RabbitMQ connected');
  return channel;
}

async function publishToQueue(queue, message) {
  if (!channel) {
    channel = await connectRabbitMQ();
  }

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  console.log(`Sent message to "${queue}":`, message);
}

module.exports = {
  connectRabbitMQ,
  publishToQueue,
};
