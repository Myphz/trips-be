import { create, client, addTrip } from "./utils";
import { test, describe } from "node:test";

export default function () {
  describe("Create", () => {
    test("Can't associate the same entity with multiple entities", async () => {
      // Create trip
      const tripId = await addTrip({ client, succeed: true });
      // Can't create other things with the same id
      await create({ client, table: "trips", params: { id: tripId, destination: "idk" }, succeed: false });
      await create({ client, table: "lodgings", params: { id: tripId, name: "idk" }, succeed: false });
      await create({
        client,
        table: "transports",
        params: { id: tripId, arrival_place: "idk", departure_place: "idk" },
        succeed: false,
      });
      await create({ client, table: "places", params: { id: tripId, name: "idk" }, succeed: false });
    });
  });
}
