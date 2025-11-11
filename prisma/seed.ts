// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 👤 create a sample user
  const user = await prisma.user.create({
    data: {
      name: "Parth",
      email: "parth@example.com",
    },
  });

  // 🏪 create store owned by this user
  const store = await prisma.store.create({
    data: {
      name: "Kanopy",
      ownerId: user.id,
    },
  });

  // 👥 create a customer
  const customer = await prisma.customer.create({
    data: {
      name: "Test Customer",
      phone: "9999999999",
      email: "customer@test.com",
      storeId: store.id,
    },
  });

  // 📦 create products
  const product1 = await prisma.product.create({
    data: {
      name: "Mechanical Keyboard",
      description: "RGB, tactile feedback, metal base",
      price: 4999,
      quantity: 10,
      storeId: store.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Wireless Mouse",
      description: "Silent clicks, long battery",
      price: 1299,
      quantity: 25,
      storeId: store.id,
    },
  });

  // 🧾 create an invoice with items
  const invoice = await prisma.invoice.create({
    data: {
      customerId: customer.id,
      storeId: store.id,
      totalAmount: product1.price * 2 + product2.price,
      items: {
        create: [
          { productId: product1.id, quantity: 2, unitPrice: product1.price },
          { productId: product2.id, quantity: 1, unitPrice: product2.price },
        ],
      },
    },
    include: { items: true },
  });

  console.log("✅ Seeded successfully!");
  console.log({ user, store, customer, invoice });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
