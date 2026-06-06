import type { AuthUser, SessionPayload } from "./types";
import { getUserById } from "./users";

const SESSION_COOKIE = "vb_session";
const SECRET = process.env.SESSION_SECRET || "vendorbridge-dev-secret-change-in-production";

export { SESSION_COOKIE };

function getSecretKey() {
  const enc = new TextEncoder();
  const keyMaterial = enc.encode(SECRET.padEnd(32, "0").slice(0, 32));
  return crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: string): Promise<string> {
  const key = await getSecretKey();
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Buffer.from(sig).toString("base64url");
}

async function verify(payload: string, signature: string): Promise<boolean> {
  try {
    const key = await getSecretKey();
    const enc = new TextEncoder();
    return crypto.subtle.verify(
      "HMAC",
      key,
      Buffer.from(signature, "base64url"),
      enc.encode(payload)
    );
  } catch {
    return false;
  }
}

export async function createSessionToken(
  user: AuthUser,
  rememberMe = false
): Promise<string> {
  const exp = Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    vendorId: user.vendorId,
    exp,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;

    const valid = await verify(encoded, signature);
    if (!valid) return null;

    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SessionPayload;

    if (!payload.exp || payload.exp < Date.now()) return null;

    const user = getUserById(payload.userId);

    // For users registered via the backend (not in DEMO_USERS),
    // trust the signed session payload.
    if (!user) {
      return payload;
    }

    return {
      ...payload,
      role: user.role,
      email: user.email,
      name: user.name,
      vendorId: user.vendorId,
    };
  } catch {
    return null;
  }
}

export function sessionToUser(session: SessionPayload): AuthUser {
  return {
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    vendorId: session.vendorId,
  };
}
