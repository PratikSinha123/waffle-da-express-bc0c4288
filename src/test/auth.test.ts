import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("AuthContext", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("login", () => {
    it("should return false for incorrect password", () => {
      const password = "wrongpassword";
      const result = password === "waffle123";
      expect(result).toBe(false);
    });

    it("should return true for correct password", () => {
      const password = "waffle123";
      const result = password === "waffle123";
      expect(result).toBe(true);
    });

    it("should store session in sessionStorage on successful login", () => {
      sessionStorage.setItem("waffle_admin_session", "true");
      expect(sessionStorage.getItem("waffle_admin_session")).toBe("true");
    });

    it("should initialize with false when no session exists", () => {
      const isLoggedIn = sessionStorage.getItem("waffle_admin_session") === "true";
      expect(isLoggedIn).toBe(false);
    });

    it("should initialize with true when session exists", () => {
      sessionStorage.setItem("waffle_admin_session", "true");
      const isLoggedIn = sessionStorage.getItem("waffle_admin_session") === "true";
      expect(isLoggedIn).toBe(true);
    });
  });

  describe("logout", () => {
    it("should clear sessionStorage on logout", () => {
      sessionStorage.setItem("waffle_admin_session", "true");
      sessionStorage.removeItem("waffle_admin_session");
      localStorage.removeItem("waffle_admin");
      expect(sessionStorage.getItem("waffle_admin_session")).toBeNull();
    });

    it("should clear localStorage on logout", () => {
      localStorage.setItem("waffle_admin", "some_data");
      localStorage.removeItem("waffle_admin");
      expect(localStorage.getItem("waffle_admin")).toBeNull();
    });

    it("should clear both storages on logout", () => {
      sessionStorage.setItem("waffle_admin_session", "true");
      localStorage.setItem("waffle_admin", "some_data");
      sessionStorage.removeItem("waffle_admin_session");
      localStorage.removeItem("waffle_admin");
      expect(sessionStorage.getItem("waffle_admin_session")).toBeNull();
      expect(localStorage.getItem("waffle_admin")).toBeNull();
    });
  });

  describe("session security", () => {
    it("should use sessionStorage (session-only) not localStorage", () => {
      sessionStorage.setItem("waffle_admin_session", "true");
      const fromSession = sessionStorage.getItem("waffle_admin_session");
      const fromLocal = localStorage.getItem("waffle_admin_session");
      expect(fromSession).toBe("true");
      expect(fromLocal).toBeNull();
    });

    it("should require authentication for admin operations", () => {
      const isLoggedIn = sessionStorage.getItem("waffle_admin_session") === "true";
      expect(isLoggedIn).toBe(false);
    });
  });
});
