import { create, client, update, user_id2, client2, addTrip } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Update", () => {
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

    describe("Update trips", () => {
      test("Can update own trips", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Can update trip
        await update({ client, table: "trips", id, params: { destination: "test2" }, succeed: true });
      });

      test("Can't update other's trips", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Client2 can't update trip
        await update({ client: client2, table: "trips", id, params: { destination: "test2" }, succeed: false });
      });

      test("Can update trips you have access to", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Add groups
        await create({ client, table: "groups", params: { trip_id: id, user_id: user_id2 }, succeed: true });
        // Client2 can now update trip
        await update({ client: client2, table: "trips", id, params: { destination: "test2" }, succeed: true });
      });
    });
  });
}
