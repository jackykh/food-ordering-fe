import API_BASE_URL from "@/utils/constant";
import mock from "@/lib/mockAdapter";

// In-memory user storage
const mockUsers: { [key: string]: { userId: string; userName: string } } = {
  user_1: { userId: "user_1", userName: "TestUser1" },
  user_2: { userId: "user_2", userName: "TestUser2" },
};

let userIdCounter = 3;

// Mock user registration API
mock.onPost(`${API_BASE_URL}/auth/signup`).reply((config) => {
  try {
    const { userName } = JSON.parse(config.data);

    if (!userName || userName.trim().length === 0) {
      return [400, { message: "Username is required" }];
    }

    const existingUser = Object.values(mockUsers).find(
      (user) => user.userName.toLowerCase() === userName.toLowerCase()
    );

    if (existingUser) {
      return [409, { message: "Username already exists" }];
    }

    const userId = `user_${userIdCounter++}`;
    const newUser = { userId, userName };
    mockUsers[userId] = newUser;

    console.log("✅ Registration successful:", newUser);
    console.log("📊 Current user list:", mockUsers);

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

    const user = Object.values(mockUsers).find(
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

export default mock;
