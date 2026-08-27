import "./setup";
import request from "supertest";
import { app } from "../app";

describe("Auth", () => {
  it("signs up a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "signup@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("signup@example.com");
    expect(res.body.user.role).toBe("student");
  });

  it("rejects signup with an invalid email", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Bad Email",
      email: "not-an-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
  });

  it("rejects a duplicate signup", async () => {
    const payload = { name: "Dup", email: "dup@example.com", password: "password123" };
    await request(app).post("/api/auth/signup").send(payload);
    const res = await request(app).post("/api/auth/signup").send(payload);

    expect(res.status).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with the wrong password", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Wrong Password",
      email: "wrongpw@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpw@example.com",
      password: "not-the-password",
    });

    expect(res.status).toBe(401);
  });

  it("rejects Google auth with a missing credential", async () => {
    const res = await request(app).post("/api/auth/google").send({});
    expect(res.status).toBe(400);
  });

  it("rejects requests to protected routes with no token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });
});
