/**
 * E2E: Authentication middleware via /api/v1/users/profile
 */
import request from "supertest";
import app from "../src/app";
import { auth } from "../config/firebaseConfig";

describe("Authentication middleware", () => {
  const validAuthHeader = "Bearer valid.jwt.token";
  const invalidAuthHeader = "Bearer invalid.jwt.token";

  it("returns 401 when Authorization header is missing", async () => {
    const response = await request(app).get("/api/v1/users/profile");
    expect(response.status).toBe(401);
    expect(response.body.status).toBe("error");
  });

  it("returns 401 when token is invalid", async () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error("invalid token")
    );

    const response = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization", invalidAuthHeader);

    expect(response.status).toBe(401);
    expect(response.body.status).toBe("error");
  });

  it("returns 200 when token is valid", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
      uid: "user-123",
      role: "user",
    });

    const response = await request(app)
      .get("/api/v1/users/profile")
      .set("Authorization", validAuthHeader);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body.data.userId).toBe("user-123");
  });
});
