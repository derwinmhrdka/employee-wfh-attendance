const amqp = require('amqplib');
const config = require('../config/config');
const logger = require('../utils/logger');
const QUEUE_NAME = 'update_profile_log';

async function publishUpdateProfileLog(oldData, newData, employeeId) {
  try {
    oldData = oldData || {};
    newData = newData || {};

    const trackedFields = [
      'name',
      'email',
      'phone',
      'photo',
      'password',
      'position',
      'active',
      'status'
    ];

    const payloads = [];

    for (const field of trackedFields) {
      const oldValue = oldData[field] ?? null;
      const newValue = newData[field] ?? null;

      if (oldValue !== newValue) {
        payloads.push({
          employeeId: Number(employeeId),
          old_value: oldValue,
          new_value: newValue,
          changed_field: field,
          updated_at: new Date().toISOString(),
        });
      }
    }

    logger.info('[Publisher] Payloads:', payloads);

    if (payloads.length === 0) {
      logger.info('[Publisher] No changes detected.');
      return;
    }

    const connection = await amqp.connect(config.rabbitUrl);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    for (const payload of payloads) {
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(payload)), {
        persistent: true,
      });
      logger.info('[Publisher] Published change for:', payload.changed_field);
    }

    await channel.close();
    await connection.close();

    logger.info('[Publisher] All changes published to queue:', QUEUE_NAME);

  } catch (err) {
    logger.error('[Publisher] Failed:', err);
  }
}

module.exports = { publishUpdateProfileLog };
