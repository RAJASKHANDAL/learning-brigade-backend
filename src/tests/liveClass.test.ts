import "./setup";
import request from "supertest";
import { app } from "../app";

async function signupTeacher(email: string) {
  const res = await request(app).post("/api/auth/signup").send({
    name: `Teacher ${email}`,
    email,
    password: "password123",
    role: "teacher",
  });
  return res.body.token as string;
}

async function signupStudent(email: string) {
  const res = await request(app).post("/api/auth/signup").send({
    name: `Student ${email}`,
    email,
    password: "password123",
    role: "student",
  });
  return res.body.token as string;
}

describe("Live class role and ownership rules", () => {
  it("rejects a student trying to start a live class", async () => {
    const studentToken = await signupStudent("student-a@example.com");

    const res = await request(app)
      .post("/api/live/start")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ title: "Sneaky class", roomId: "room-1" });

    expect(res.status).toBe(403);
  });

  it("lets a teacher start a live class", async () => {
    const teacherToken = await signupTeacher("teacher-a@example.com");

    const res = await request(app)
      .post("/api/live/start")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ title: "Real class", roomId: "room-2" });

    expect(res.status).toBe(200);
    expect(res.body.liveClass.roomId).toBe("room-2");
  });

  it("does not let a different teacher end someone else's live class", async () => {
    const teacherAToken = await signupTeacher("teacher-b@example.com");
    const teacherBToken = await signupTeacher("teacher-c@example.com");

    await request(app)
      .post("/api/live/start")
      .set("Authorization", `Bearer ${teacherAToken}`)
      .send({ title: "Teacher A's class", roomId: "room-3" });

    const res = await request(app)
      .post("/api/live/end")
      .set("Authorization", `Bearer ${teacherBToken}`)
      .send();

    expect(res.status).toBe(403);
  });

  it("lets the owning teacher end their own live class", async () => {
    const teacherToken = await signupTeacher("teacher-d@example.com");

    await request(app)
      .post("/api/live/start")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ title: "Ends fine", roomId: "room-4" });

    const res = await request(app)
      .post("/api/live/end")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send();

    expect(res.status).toBe(200);
  });
});
