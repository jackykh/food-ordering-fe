import MockAdapter from "axios-mock-adapter";
import axios from "axios";

// Create Mock Adapter instance
const mock = new MockAdapter(axios, { delayResponse: 500 }); // optional delay for realism

// In-memory user storage
const users: { [key: string]: { userId: string; userName: string } } = {};
let userIdCounter = 1;

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Mock user registration API
mock.onPost(`${API_BASE_URL}/auth/signup`).reply((config) => {
  try {
    const { userName } = JSON.parse(config.data);

    if (!userName || userName.trim().length === 0) {
      return [400, { message: "Username is required" }];
    }

    // Check if userName already exists
    const existingUser = Object.values(users).find(
      (user) => user.userName.toLowerCase() === userName.toLowerCase()
    );

    if (existingUser) {
      return [409, { message: "Username already exists" }];
    }

    // Create new user
    const userId = `user_${userIdCounter++}`;
    const newUser = { userId, userName };
    users[userId] = newUser;

    console.log("✅ Registration successful:", newUser);
    console.log("📊 Current user list:", users);

    return [200, newUser];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Registration failed:", error.message);
    } else {
      console.error("❌ Registration failed:", error);
    }
    return [500, { message: "Internal server error" }];
  }
});

// Mock user login API
mock.onPost(`${API_BASE_URL}/auth/login`).reply((config) => {
  try {
    const { userName } = JSON.parse(config.data);

    if (!userName || userName.trim().length === 0) {
      return [400, { message: "Username is required" }];
    }

    // Find user by userName
    const user = Object.values(users).find(
      (user) => user.userName.toLowerCase() === userName.toLowerCase()
    );

    if (!user) {
      return [404, { message: "User not found, please register" }];
    }

    console.log("✅ Login successful:", user);

    return [200, user];
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Login failed:", error.message);
    } else {
      console.error("❌ Login failed:", error);
    }
    return [500, { message: "Internal server error" }];
  }
});

// Function to seed initial test users
const seedUsers = () => {
  const testUsers = [
    { userId: "user_1", userName: "TestUser1" },
    { userId: "user_2", userName: "TestUser2" },
  ];

  testUsers.forEach((user) => {
    users[user.userId] = user;
  });

  userIdCounter = testUsers.length + 1;
  console.log("🌱 Initialized test users:", users);
};

seedUsers();

export default mock;
