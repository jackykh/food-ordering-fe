/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import { authApi } from "../api/auth";
import "../api/mock/authApi"; // Import mock setup

describe("Auth API", () => {
  describe("signup", () => {
    it("should successfully register a new user", async () => {
      const response = await authApi.signup({ userName: "NewTestUser" });

      expect(response.success).toBe(true);
      expect(response.message).toBe("Registration successful");
      expect(response.data).toHaveProperty("id");
      expect(response.data).toHaveProperty("name", "NewTestUser");
    });

    it("should return error when username is empty", async () => {
      try {
        await authApi.signup({ userName: "" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.detail[0].msg).toBe("Username is required");
      }
    });

    it("should return error when username already exists", async () => {
      // First registration
      await authApi.signup({ userName: "DuplicateUser" });

      // Second registration with same username
      try {
        await authApi.signup({ userName: "DuplicateUser" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(409);
        expect(error.response.data.detail[0].msg).toBe(
          "Username already exists"
        );
      }
    });

    it("should be case-insensitive when checking duplicate usernames", async () => {
      await authApi.signup({ userName: "CaseTest" });

      try {
        await authApi.signup({ userName: "casetest" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(409);
      }
    });
  });

  describe("login", () => {
    it("should successfully login with existing user", async () => {
      const response = await authApi.login({ userName: "TestUser1" });

      expect(response.success).toBe(true);
      expect(response.message).toBe("Login successful");
      expect(response.data).toHaveProperty("id", 1);
      expect(response.data).toHaveProperty("name", "TestUser1");
    });

    it("should return error when username is empty", async () => {
      try {
        await authApi.login({ userName: "" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.detail[0].msg).toBe("Username is required");
      }
    });

    it("should return error when user does not exist", async () => {
      try {
        await authApi.login({ userName: "NonExistentUser" });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.detail[0].msg).toBe(
          "User not found, please register"
        );
      }
    });

    it("should be case-insensitive when logging in", async () => {
      const response = await authApi.login({ userName: "testuser1" });

      expect(response.success).toBe(true);
      expect(response.data.name).toBe("TestUser1");
    });

    it("should login with second test user", async () => {
      const response = await authApi.login({ userName: "TestUser2" });

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty("id", 2);
      expect(response.data).toHaveProperty("name", "TestUser2");
    });
  });
});
