import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import connectDB from "./config/db.js";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import Order from "./models/order.model.js";

dotenv.config();

/**
 * Seed Script
 * Generate random users, products, and orders
 * Used for analytics testing
 */
const seedDatabse = async () => {
  try {
    await connectDB();

    console.log("clearing exsting data...");

    //Clear existing collections
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    /**
     * Create Users
     */
    const users = [];

    for (let i = 0; i < 50; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email(),
      });
    }

    const createdUsers = await User.insertMany(users);
    console.log("Users created", createdUsers.length);

    /**
     * Create Products
     */
    const products = [];

    for (let i = 0; i < 20; i++) {
      products.push({
        name: faker.commerce.productName(),
        price: Number(faker.commerce.price({ min: 1000, max: 50000 })),
      });
    }

    const createdProducts = await Product.insertMany(products);
    console.log("Products create:", createdProducts.length);

    /**
     * Create Orders
     * Spread orders across last 6 months
     */
    const orders = [];

    for (let i = 0; i < 300; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];

      const randomProduct =
        createdProducts[Math.floor(Math.random() * createdProducts.length)];

      const randomDate = faker.date.past({ years: 1 });

      orders.push({
        user: randomUser._id,
        product: randomProduct._id,
        amount: randomProduct.price,
        createdAt: randomDate,
        updatedAt: randomDate,
      });
    }
    const createOrders = await Order.insertMany(orders);
    console.log("Order created:", createOrders.length);

    console.log("Database seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabse();
