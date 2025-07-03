const { connectRabbitMQ } = require('../config/rabbitmq');

async function consume(queueName, callback) {
  const conn = await connectRabbitMQ();
  const channel = await conn.createChannel();

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      console.log(`[x] Received:`, content);

      await callback(content);

      channel.ack(msg);
    }
  });

  console.log(` [*] Waiting for messages in ${queueName}`);
}

module.exports = { consume };
