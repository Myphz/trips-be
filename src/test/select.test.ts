import { create, client, user_id2, client2, addTrip, select, acceptGroup, addGroup } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Select", () => {
    describe("Select entities", () => {
      test("Can select own entities", async () => {
        // Create entity
        await create({ client, table: "entities", params: {}, succeed: true });
        // Can select entity
        await select({ client, table: "entities", succeed: true });
      });

      test("Can't select other's entities", async () => {
        // Create entity
        await create({ client, table: "entities", params: {}, succeed: true });
        // Client2 can't select entity
        await select({ client: client2, table: "entities", succeed: false });
      });

      test("Can select entities you have access to", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create groups
        const groupid = await addGroup({ client, succeed: true, tripid: id, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });

        // Client2 can select entity
        await select({ client: client2, table: "entities", succeed: true });
      });
    });
  });
}
