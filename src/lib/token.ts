import { sign } from "hono/jwt";

export async function signToken(userId: string) {
  const payload = {
    sub: userId,
  };
  const secret = process.env.TOKEN_SECRET_KEY;
}
