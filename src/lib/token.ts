import { sign, verify } from "hono/jwt";

type Payload = {
  sub: string;
  role: string;
  exp: number;
};

export async function signToken(userId: string) {
  const payload: Payload = {
    sub: userId,
    role: "user",
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  };
  const secret: string = String(process.env.TOKEN_SECRET_KEY);
  const token = await sign(payload, secret);
  return token;
}

export async function verifyToken(tokenToVerify: string) {
  // TODO: Asking formatting
  const secretKey: string = String(process.env.TOKEN_SECRET_KEY);
  return (await verify(tokenToVerify, secretKey)) as Payload;
}
