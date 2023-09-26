import { create, client, user_id2, client2, addTrip, del, select, addGroup, acceptGroup } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Photos", () => {
    describe("Create photos", () => {
      test("Can create photos for own trips", async () => {
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

      test("Can create photos for trips you have access to", async () => {
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
        const groupid = await addGroup({ client, succeed: true, tripid: id, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });

        // Client2 can add photos to place
        await create({
          client: client2,
          table: "photos",
          params: { entity_id: entityId, id: "testoz" },
          succeed: true,
        });
      });

      test("Can't create photos for trips you don't have access to", async () => {
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

    describe("Select photos", () => {
      test("Can select photos for own trips", async () => {
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
        // Can select photo
        await select({ client, table: "photos", succeed: true });
      });

      test("Can select photos for trips you joined", async () => {
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
        // Add client2 to trip
        const groupid = await addGroup({ client, succeed: true, tripid: id, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });
        // Client2 can select photo
        await select({ client: client2, table: "photos", succeed: true });
      });

      test("Can't select photos for other's trips", async () => {
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
        // Client2 can't select photo
        await select({ client: client2, table: "photos", succeed: false });
      });
    });

    describe("Delete photos", () => {
      test("Can delete photos for own trips", async () => {
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

        // Delete photo
        await del({ client, table: "photos", succeed: true });
      });

      test("Can delete other's photos if you are the owner", async () => {
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
        const groupid = await addGroup({ client, succeed: true, tripid: id, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });
        // Client2 adds photos to place
        await create({
          client: client2,
          table: "photos",
          params: { entity_id: entityId, id: "testoz" },
          succeed: true,
        });
        // Client1 can delete photo
        await del({ client, table: "photos", succeed: true });
      });
    });
  });
}
