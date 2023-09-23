import { create, client, user_id2, client2, addTrip } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Photos", () => {
    describe("Create photos", () => {
      test("Can create photos for own places", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create place
        const entityId = await create({
          client,
          table: "entities",
          params: { parent: id, trip_id: id },
          succeed: true,
        });
        await create({ client, table: "places", params: { id: entityId, name: "test" }, succeed: true });

        // Add photos to place
        await create({ client, table: "photos", params: { entity_id: entityId, id: "testoz" }, succeed: true });
      });

      test("Can create photos for places you have access to", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create place
        const entityId = await create({
          client,
          table: "entities",
          params: { parent: id, trip_id: id },
          succeed: true,
        });
        await create({ client, table: "places", params: { id: entityId, name: "test" }, succeed: true });
        // Add client2 to trip
        await create({ client, table: "groups", params: { trip_id: id, user_id: user_id2 }, succeed: true });

        // Client2 can add photos to place
        await create({
          client: client2,
          table: "photos",
          params: { entity_id: entityId, id: "testoz" },
          succeed: true,
        });
      });

      test("Can't create photos for places you don't have access to", async () => {
        // Create trip
        const id = await addTrip({ client, succeed: true });
        // Create place
        const entityId = await create({
          client,
          table: "entities",
          params: { parent: id, trip_id: id },
          succeed: true,
        });
        await create({ client, table: "places", params: { id: entityId, name: "test" }, succeed: true });
        // Client2 can't add photos to place
        await create({
          client: client2,
          table: "photos",
          params: { entity_id: entityId, id: "testoz" },
          succeed: false,
        });
      });
    });
  });
}
