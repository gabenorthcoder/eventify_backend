import request from "supertest";
import express from "express";
import { signupEvent } from "./signUpEvent";
import { User } from "../../../infrastructure/repository/entities/user";
import { SignupEventUseCase } from "../../../application/useCases/signupForEventUseCase";

jest.mock("../../../application/useCases/signupForEventUseCase");

const app = express();
app.use(express.json());
app.use("/events", signupEvent);

describe("POST /events/:id/signup", () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = { id: 1, uuid: "creator-uuid", email: "creator@example.com", password: "hashed-password", firstName: "Creator", lastName: "User" } as User
    jest.clearAllMocks();
  });

  it("should return 400 if the ID is not a positive integer", async () => {
    const response = await request(app)
      .post("/events/abc/signup")
      .send({ flag: true })
      .set("user", JSON.stringify(mockUser));

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid ID. It must be a positive integer greater than 0.");
  });

  it("should return 401 if the user is not authenticated", async () => {
    const response = await request(app)
      .post("/events/1/signup")
      .send({ flag: true });


    expect(response.body.message).toBe("Unauthorized: User not authenticated");
  });


});