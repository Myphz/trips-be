import { PostgrestError, createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";
import { throwError } from "../utils/throw";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import assert from "node:assert/strict";
import { after, beforeEach } from "node:test";

dotenv.config();
dotenv.config({ path: ".env.test" });

const SUPABASE_URL = process.env.SUPABASE_URL ?? throwError("supabase url");
const ANON_KEY = process.env.ANON_KEY ?? throwError("anon key");

export const user_id = "4d3e1bb5-492e-4fd7-8dfd-fe9f9d75de43";
export const user_id2 = "ac791267-b0a8-4f94-ab40-0a1cd846d000";

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

function checkIsGood({ error, count }: { error: PostgrestError | null; count?: number }) {
  assert.equal(error, null);
  if (count !== undefined) assert.equal(count, 1);
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

export async function select<T extends keyof Database["public"]["Tables"]>({
  client,
  table,
  succeed,
  cond,
}: {
  client: typeof client2;
  table: T;
  succeed: boolean;
  cond?: Partial<Database["public"]["Tables"][T]>;
}) {
  let query = client.from(table).select("*");
  Object.entries(cond ?? {}).forEach(([key, val]) => (query = query.eq(key, val)));

  const { error, count } = await query;

  if (succeed) checkIsGood({ error });
  else checkIsBad({ error, count });
}

export async function del<T extends keyof Database["public"]["Tables"]>({
  client,
  table,
  succeed,
  id,
}: {
  client: typeof client2;
  table: T;
  succeed: boolean;
  id?: string;
}) {
  const query = id ? client.from(table).delete().eq("id", id) : client.from(table).delete().neq("id", 0);
  const { error, count } = await query;

  if (succeed) checkIsGood({ error });
  else checkIsBad({ error, count });
}

export async function addGroup({
  client,
  succeed,
  tripid,
  user_id,
}: {
  client: typeof client2;
  succeed: boolean;
  tripid: number;
  user_id: string;
}) {
  return await create({
    client,
    table: "groups",
    params: {
      user_id: user_id,
      trip_id: tripid,
    },
    succeed,
  });
}

export async function acceptGroup({
  client,
  succeed,
  groupid,
}: {
  client: typeof client2;
  succeed: boolean;
  groupid: string;
}) {
  await update({ client, id: groupid, table: "groups", params: { accepted: true }, succeed });
}

export async function addTrip({
  client,
  id,
  succeed,
  trip_id,
  parent,
  addGroup = true,
}: {
  client: typeof client2;
  id?: number;
  succeed: boolean;
  trip_id?: number;
  parent?: number;
  addGroup?: boolean;
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

  const ret = await create({
    client,
    table: "trips",
    params: { id: entityId, destination: "test" },
    succeed,
  });

  // Create group
  addGroup &&
    (await create({
      client,
      table: "groups",
      params: { trip_id: ret, accepted: true },
      succeed: true,
    }));

  return ret;
}

export const cleaner = () => {
  const cleanup = async () => {
    // Delete all entities
    await client.from("entities").delete().eq("user_id", user_id);
    await client2.from("entities").delete().eq("user_id", user_id2);
  };
  beforeEach(cleanup);
  after(cleanup);
};
