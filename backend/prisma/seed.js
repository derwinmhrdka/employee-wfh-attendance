import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Employees dan Admins starter
  const users = [
    {
      name: 'King Ragalufx',
      email: 'ragaluf@gmail.com',
      password: '$2b$10$F5mLawC2UxzIuBC.6UhVu.0gY8Z6nHZ6fLGGrdEN5UuEfCfvJhX0C',
      phone: '082211223344',
      photo: 'ragaluf_pic.jpg',
      is_admin: false,
      position: 'Software Engineer',
      status: 'active',
    },
    {
      name: 'ilham joseph',
      email: 'joseph@gmail.com',
      password: '$2b$10$sYLzDufcbrJT0fYg9OFHK.Rknj/LXF5ShAdROBQz7zRnpnxDp5R5m',
      phone: '082244556677',
      photo: 'joseph_pic.jpg',
      is_admin: true,
      position: 'HRD',
      status: 'active',
    },
    {
      name: 'Sumbul',
      email: 'sumbul@gmail.com',
      password: '$2b$10$6z99jFadgphA71Pv2Q18rOTd1Fy1/avaCZfaBtE0ABvki7ePLEHCC',
      phone: '081234567891',
      photo: 'sumbul_pic.jpg',
      is_admin: false,
      position: 'Quality Assurance',
      status: 'active',
    },
    {
      name: 'Admin HO',
      email: 'adminHO@gmail.com',
      password: '$2b$10$PygzwE5rPSZSWXS8poa7mOWUgqbniQq5qqXgM/t7ykuWo73wlTHPW',
      phone: '081234567891',
      photo: 'adminHO_pic.jpg',
      is_admin: true,
      position: 'Admin HO',
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
