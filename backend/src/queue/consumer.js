const amqp = require('amqplib');
const prisma = require('../config/prismaClient');

const QUEUE_NAME = 'update_profile_log';

async function startConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('[Consumer] Waiting for messages...');

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        const payload = JSON.parse(msg.content.toString());
        console.log('[Consumer] Received payload:', payload);

        await prisma.logUpdateProfile.create({
          data: {
            employee_id: payload.employeeId,
            old_value: String(payload.old_value),
            new_value: String(payload.new_value),
            changed_field: payload.changed_field,
            updated_at: payload.updated_at,
          },
        });

        console.log(`[Consumer] Saved log for field: ${payload.changed_field}`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('[Consumer] Failed:', err);
  }
}

startConsumer();
