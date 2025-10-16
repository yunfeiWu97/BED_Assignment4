/**
 * E2E: Authorization middleware on loan endpoints
 */
import request from "supertest";
import app from "../src/app";
import { auth } from "../config/firebaseConfig";

describe("Authorization middleware", () => {
  const authHeaderFor = (role: string, uid = "u-1") =>
    `Bearer mocked.${role}.${uid}`;

  it("allows USER to POST /api/v1/loans", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "u-1",
      role: "user",
    });

    const response = await request(app)
      .post("/api/v1/loans")
      .set("Authorization", authHeaderFor("user"))
      .send({ amount: 1000 });

    expect([200, 201]).toContain(response.status);
    expect(response.body.status).toBe("success");
  });

  it("forbids USER to PUT /api/v1/loans/:id/approve (manager only)", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "u-1",
      role: "user",
    });

    const response = await request(app)
      .put("/api/v1/loans/abc/approve")
      .set("Authorization", authHeaderFor("user"));

    expect(response.status).toBe(403);
    expect(response.body.status).toBe("error");
  });

  it("allows OFFICER to PUT /api/v1/loans/:id/review", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "off-1",
      role: "officer",
    });

    const response = await request(app)
      .put("/api/v1/loans/abc/review")
      .set("Authorization", authHeaderFor("officer"));

    expect(response.status).toBe(200);
  });

  it("allows MANAGER to GET /api/v1/loans and PUT /:id/approve", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "m-1",
      role: "manager",
    });

    const listResponse = await request(app)
      .get("/api/v1/loans")
      .set("Authorization", authHeaderFor("manager"));
    expect(listResponse.status).toBe(200);

    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "m-1",
      role: "manager",
    });

    const approveResponse = await request(app)
      .put("/api/v1/loans/abc/approve")
      .set("Authorization", authHeaderFor("manager"));
    expect(approveResponse.status).toBe(200);
  });
});
