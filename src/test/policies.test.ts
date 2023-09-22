/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, describe, beforeEach } from "node:test";
import { client, client2, addTrip, create, user_id, user_id2, update } from "./utils";

describe("Business Logic", () => {
  beforeEach(async () => {
    // Delete all entities
    await client.from("entities").delete().eq("user_id", user_id);
    await client2.from("entities").delete().eq("user_id", user_id2);
  });

  describe("Good cases", () => {
    test("Regular Flow", async () => {
      // Create entity & trip
      const tripid = await addTrip({ client, succeed: true });
      // Create group to establish dominance
      await create({ client, table: "groups", params: { trip_id: tripid }, succeed: true });
      // Create subtrip associated with the trip
      await addTrip({ client, trip_id: tripid, parent: tripid, succeed: true });
    });
  });

  describe("Business logic", () => {
    test("Can't lie about user_id", async () => {
      // Use client2, but use user_id of client1
      await create({
        client: client2,
        table: "entities",
        params: { user_id },
        succeed: false,
      });
    });

    test("Can't create a trip in somebody else's trip", async () => {
      // Create entity & trip
      const tripid = await addTrip({ client, succeed: true });
      // Create subentity associated with the trip from another account
      await create({ client: client2, table: "entities", params: { trip_id: tripid, parent: tripid }, succeed: false });

      // Specify just parent
      await create({ client: client2, table: "entities", params: { parent: tripid }, succeed: false });

      // Specify just trip id
      await create({ client: client2, table: "entities", params: { trip_id: tripid }, succeed: false });
    });

    test("Can't create a group for a trip not yours", async () => {
      // Create entity & trip
      const tripid = await addTrip({ client, succeed: true });

      // Create group for you
      await create({
        client,
        table: "groups",
        params: {
          trip_id: tripid,
        },
        succeed: true,
      });

      // Liar: create a group for a trip not yours
      await create({
        client: client2,
        table: "groups",
        params: {
          trip_id: tripid,
        },
        succeed: false,
      });
    });

    test("Can't add someone to trip if you're not owner", async () => {
      // Create entity & trip
      const tripid = await addTrip({ client, succeed: true });

      // Create group for you
      await create({
        client,
        table: "groups",
        params: {
          trip_id: tripid,
        },
        succeed: true,
      });

      // Create a group for friend
      await create({
        client,
        table: "groups",
        params: {
          trip_id: tripid,
          user_id: user_id2,
        },
        succeed: true,
      });

      // Your friend can't add others to group
      await create({
        client: client2,
        table: "groups",
        params: {
          trip_id: tripid,
        },
        succeed: false,
      });
    });
  });

  describe("Update entities", () => {
    test("Can update own entities", async () => {
      // Create entity
      const id = await create({ client, table: "entities", params: {}, succeed: true });
      // Can update entity (e.g rating)
      await update({ client, table: "entities", id, params: { rating: 5 }, succeed: true });
      // Cannot update owner
      await update({ client, table: "entities", id, params: { user_id: user_id2 }, succeed: false });
    });

    test("Can't update other's entities", async () => {
      // Create entity
      const id = await create({ client, table: "entities", params: {}, succeed: true });
      // Client2 can't update entity (e.g rating)
      await update({ client: client2, table: "entities", id, params: { rating: 5 }, succeed: false });
      // Cannot update owner
      await update({ client: client2, table: "entities", id, params: { user_id: user_id2 }, succeed: false });
    });

    test("Can't update trip_id to someone else's", async () => {
      // Create entity
      const id = await create({ client, table: "entities", params: {}, succeed: true });
      // Client2 can't update entity (e.g rating)
      await update({ client: client2, table: "entities", id, params: { rating: 5 }, succeed: false });
      // Cannot update owner
      await update({ client: client2, table: "entities", id, params: { user_id: user_id2 }, succeed: false });
    });
  });
});
