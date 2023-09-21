/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from "dotenv";
import { test, describe, beforeEach } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { throwError } from "../utils/throw";
import { PostgrestError, createClient } from "@supabase/supabase-js";

import type { Database } from "../types/supabase";

dotenv.config({ path: ".env.test" });

const SUPABASE_URL = process.env.SUPABASE_URL ?? throwError("supabase url");
const ANON_KEY = process.env.ANON_KEY ?? throwError("anon key");

const user_id = "6b66be31-4966-4503-9dd4-67a44c1c0505";
const user_id2 = "807e08e3-1b6d-4cb5-b3f9-55758e68dd3c";

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

const client = createClient<Database>(SUPABASE_URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${authToken}` } },
});

const client2 = createClient<Database>(SUPABASE_URL, ANON_KEY, {
  global: { headers: { Authorization: `Bearer ${authToken2}` } },
});

function checkIsGood<T>({ data, error }: { data: T; error: PostgrestError | null }) {
  assert.equal(error, null);
  3;
  return { data: data as T | null, error: error as PostgrestError | null };
}

function checkIsBad<T>({ data, error, count }: { data: T; error: PostgrestError | null; count: number | null }) {
  assert.ok(error || !count);
  return { data: data as T | null, error: error as PostgrestError | null };
}

describe("Tests", () => {
  beforeEach(async () => {
    // Delete all entities
    await client.from("entities").delete().eq("user_id", user_id);
    await client2.from("entities").delete().eq("user_id", user_id2);
  });
  describe("Good cases", () => {
    test("Regular Flow", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any;

      ({ data } = checkIsGood(await client.from("entities").insert([{}]).select()));
      const { id } = data![0];

      // Create trip associated with the entity
      ({ data } = checkIsGood(
        await client
          .from("trips")
          .insert([
            {
              id,
              destination: "test",
            },
          ])
          .select(),
      ));

      const tripid = data[0].id;

      // Create group to establish dominance
      ({ data } = checkIsGood(
        await client
          .from("groups")
          .insert([
            {
              trip_id: tripid,
            },
          ])
          .select(),
      ));

      // Create subtrip associated with the trip
      ({ data } = checkIsGood(
        await client
          .from("entities")
          .insert([
            {
              parent: tripid,
              trip_id: tripid,
            },
          ])
          .select(),
      ));

      ({ data } = checkIsGood(
        await client
          .from("trips")
          .insert([
            {
              id: data[0].id,
              destination: "test",
            },
          ])
          .select(),
      ));
    });
  });

  describe("Business logic", () => {
    test("Can't lie about user_id", async () => {
      // Use client2, but use user_id of client1
      checkIsBad(
        await client2
          .from("entities")
          .insert([
            {
              user_id,
            },
          ])
          .select(),
      );
    });

    test("Can't create a trip in somebody else's trip", async () => {
      // Create entity
      let data: any;
      ({ data } = checkIsGood(await client.from("entities").insert([{}]).select()));

      const { id } = data[0];

      // Create trip associated with the entity
      ({ data } = checkIsGood(
        await client
          .from("trips")
          .insert([
            {
              id,
              destination: "test",
            },
          ])
          .select(),
      ));

      const tripid = data[0].id;

      // Create subentity associated with the trip from another account
      ({ data } = checkIsBad(
        await client2
          .from("entities")
          .insert([
            {
              parent: tripid,
              trip_id: tripid,
            },
          ])
          .select(),
      ));
    });

    test("Can't create a group for a trip not yours", async () => {
      // Create entity
      let data: any;
      ({ data } = checkIsGood(await client.from("entities").insert([{}]).select()));

      const { id } = data[0];

      // Create trip associated with the entity
      ({ data } = checkIsGood(
        await client
          .from("trips")
          .insert([
            {
              id,
              destination: "test",
            },
          ])
          .select(),
      ));

      const tripid = data[0].id;

      // Create a group for you
      ({ data } = checkIsGood(
        await client
          .from("groups")
          .insert([
            {
              trip_id: tripid,
            },
          ])
          .select(),
      ));

      // Liar: create a group for a trip not yours
      ({ data } = checkIsBad(
        await client2
          .from("groups")
          .insert([
            {
              trip_id: tripid,
            },
          ])
          .select(),
      ));
    });

    test("Can't add someone to trip if you're not owner", async () => {
      let data: any;
      // Create entity
      ({ data } = checkIsGood(await client.from("entities").insert([{}]).select()));

      const { id } = data[0];

      // Create trip associated with the entity
      ({ data } = checkIsGood(
        await client
          .from("trips")
          .insert([
            {
              id,
              destination: "test",
            },
          ])
          .select(),
      ));

      const tripid = data[0].id;

      // Create a group for you
      ({ data } = checkIsGood(
        await client
          .from("groups")
          .insert([
            {
              trip_id: tripid,
            },
          ])
          .select(),
      ));

      // Create a group for friend
      ({ data } = checkIsGood(
        await client
          .from("groups")
          .insert([
            {
              user_id: user_id2,
              trip_id: tripid,
            },
          ])
          .select(),
      ));

      // Your friend can't add others to group
      ({ data } = checkIsBad(
        await client2
          .from("groups")
          .insert([
            {
              trip_id: tripid,
            },
          ])
          .select(),
      ));
    });
  });

  describe("Update entities", () => {
    test("Can update own entities", async () => {
      // Create entity
      const { data } = checkIsGood(await client.from("entities").insert([{}]).select());

      const { id } = data![0];

      // Can update entity (e.g rating)
      checkIsGood(
        await client
          .from("entities")
          .update({
            rating: 5,
          })
          .eq("id", id)
          .select(),
      );

      // Cannot update owner
      checkIsBad(
        await client
          .from("entities")
          .update({
            user_id: user_id2,
          })
          .eq("id", id)
          .select(),
      );
    });

    test("Can't update other's entities", async () => {
      // Create entity
      const { data } = checkIsGood(await client.from("entities").insert([{}]).select());

      const { id } = data![0];

      // Client2 can't update entity (e.g rating)
      checkIsBad(
        await client2
          .from("entities")
          .update({
            rating: 5,
          })
          .eq("id", id)
          .select(),
      );

      // Cannot update owner
      checkIsBad(
        await client2
          .from("entities")
          .update({
            user_id: user_id2,
          })
          .eq("id", id)
          .select(),
      );
    });
  });
});
