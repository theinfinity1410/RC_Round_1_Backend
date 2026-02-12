import bcrypt from 'bcryptjs';
import { prisma } from './src/config/db.js';

const seedUser = async () => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('hashed_dummy_password', 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'sarth.com',
        password: hashedPassword,
        username: 'sarth',
        name: 'Sarth'
      }
    });

    console.log(' User created successfully:', user);

    // Create progress record
    const progress = await prisma.progress.create({
      data: {
        userId: user.userId
      }
    });

    console.log(' Progress record created:', progress);

  } catch (err) {
    console.error(' Error:', err instanceof Error ? err.message : err);
  } finally {
    await prisma.$disconnect();
  }
};

seedUser();
