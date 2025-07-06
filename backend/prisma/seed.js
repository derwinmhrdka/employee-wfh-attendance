import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: 'Admin Account',
      email: 'admin@gmail.com',
      password: '$2b$10$2EpwUMQMw4ElmtAdTi7/7uw7RRGx5gzIxs9JC4U8tSaWQGKGBMXYy', //WHATT072025
      phone: '082211223344',
      photo: 'default.png',
      is_admin: true,
      position: 'HRD',
      status: 'active',
    },
    {
      name: 'Staff Account',
      email: 'staff@gmail.com',
      password: '$2b$10$2EpwUMQMw4ElmtAdTi7/7uw7RRGx5gzIxs9JC4U8tSaWQGKGBMXYy', //WHATT072025
      phone: '082211223344',
      photo: 'default.png',
      is_admin: false,
      position: 'Software Engineer',
      status: 'active',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('✅ Seed data inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
