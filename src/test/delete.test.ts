import { create, client, user_id2, client2, addTrip, del } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Delete", () => {
    describe("Delete entities", () => {
      test("Can delete own entities", async () => {
        // Create entity
        await create({ client, table: "entities", params: {}, succeed: true });
        // Can delete own entity
        await del({ client, table: "entities", succeed: true });
      });

      test("Can't delete other's entities if you are not the owner", async () => {
        // Create entity
        await create({ client, table: "entities", params: {}, succeed: true });
        // Client2 can't delete entity
        await del({ client: client2, table: "entities", succeed: false });
      });

      test("Can delete entities you have access to", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create groups
        await create({ client, table: "groups", params: { trip_id: id }, succeed: true });
        await create({ client, table: "groups", params: { trip_id: id, user_id: user_id2 }, succeed: true });

        // Client2 can't delete entity
        await del({ client: client2, table: "entities", succeed: false });
      });

      test("Can delete other's entities if you are the owner", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create groups
        await create({ client, table: "groups", params: { trip_id: id }, succeed: true });
        await create({ client, table: "groups", params: { trip_id: id, user_id: user_id2 }, succeed: true });
        // Client2 create entity
        await create({ client: client2, table: "entities", params: { parent: id, trip_id: id }, succeed: true });
        // Owner can delete client2's entity
        await del({ client: client2, table: "entities", succeed: true, id });
      });
    });
  });
}
