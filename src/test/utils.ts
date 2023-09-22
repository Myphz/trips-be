import { PostgrestError, createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import { throwError } from "../utils/throw";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import assert from "node:assert/strict";

dotenv.config({ path: ".env.test" });

const SUPABASE_URL = process.env.SUPABASE_URL ?? throwError("supabase url");
const ANON_KEY = process.env.ANON_KEY ?? throwError("anon key");

export const user_id = "6b66be31-4966-4503-9dd4-67a44c1c0505";
export const user_id2 = "807e08e3-1b6d-4cb5-b3f9-55758e68dd3c";

function generateJWT(email: string, id: string) {
  const now = Math.floor(+new Date() / 1000) - 20;
  const exp = now + 99999;

  const payload = {
    aud: "authenticated",
    exp,
    iat: now,
    iss: `${SUPABASE_URL ?? throwError("supabase url")}/auth/v1`,
    sub: id,
    email: email,
    phone: "",
    app_metadata: {
      provider: "email",
      providers: ["email"],
    },
    user_metadata: {},
    role: "authenticated",
    aal: "aal1",
    amr: [
      {
        method: "otp",
        timestamp: now,
      },
    ],
  };

  return jwt.sign(payload, process.env.JWT_SECRET ?? throwError("JWT_SECRET not set"));
}

const authToken = generateJWT("test@test.com", user_id);
const authToken2 = generateJWT("test@test2.com", user_id2);

export const client = createClient<Database>(SUPABASE_URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${authToken}` } },
});

export const client2 = createClient<Database>(SUPABASE_URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${authToken2}` } },
});

function checkIsGood({ error }: { error: PostgrestError | null }) {
  assert.equal(error, null);
}

function checkIsBad({ error, count }: { error: PostgrestError | null; count: number | null }) {
  assert.ok(error || !count);
}

export async function create<T extends keyof Database["public"]["Tables"]>({
  client,
  table,
  params,
  succeed,
}: {
  client: typeof client2;
  table: T;
  params: Database["public"]["Tables"][T]["Insert"];
  succeed: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data, error, count } = await client.from(table).insert([params]).select();

  if (succeed) checkIsGood({ error });
  else checkIsBad({ error, count });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const id = data?.[0].id;
  id !== undefined && assert.ok(id);

  return id;
}

export async function update<T extends keyof Database["public"]["Tables"]>({
  client,
  table,
  id,
  params,
  succeed,
}: {
  client: typeof client2;
  table: T;
  params: Database["public"]["Tables"][T]["Update"];
  succeed: boolean;
  id: string;
}) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data, error, count } = await client.from(table).update(params).eq("id", id).select();

  if (succeed) checkIsGood({ error });
  else checkIsBad({ error, count });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  data?.[0]?.id !== undefined && assert.ok(data?.[0]?.id);
}

export async function addTrip({
  client,
  id,
  succeed,
  trip_id,
  parent,
}: {
  client: typeof client2;
  id?: number;
  succeed: boolean;
  trip_id?: number;
  parent?: number;
}) {
  const entityId =
    id ??
    (await create({
      client,
      table: "entities",
      params: {
        ...(trip_id && { trip_id }),
        ...(parent && { parent }),
      },
      succeed: true,
    }));

  return await create({
    client,
    table: "trips",
    params: { id: entityId, destination: "test" },
    succeed,
  });
}
