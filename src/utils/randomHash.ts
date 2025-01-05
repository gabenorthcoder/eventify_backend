import crypto from "crypto";

export const randomHash = crypto.randomBytes(512).toString("hex");
