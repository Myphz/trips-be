/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, describe } from "node:test";
import { client, client2, addTrip, create, user_id, user_id2, addGroup, acceptGroup } from "./utils";

export default function () {
  describe("Business Logic", () => {
    describe("Good cases", () => {
      test("Regular Flow", async () => {
        // Create entity & trip
        const tripid = await addTrip({ client, succeed: true });
        // Create subtrip associated with the trip
        await addTrip({ client, trip_id: tripid, parent: tripid, succeed: true });
      });
    });

    describe("Main logic", () => {
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
        await create({
          client: client2,
          table: "entities",
          params: { trip_id: tripid, parent: tripid },
          succeed: false,
        });

        // Specify just parent
        await create({ client: client2, table: "entities", params: { parent: tripid }, succeed: false });
        // Specify just trip id
        await create({ client: client2, table: "entities", params: { trip_id: tripid }, succeed: false });
      });

      test("Can't create a group for a trip not yours", async () => {
        // Create entity & trip
        const tripid = await addTrip({ client, succeed: true });

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

        // Create a group for friend
        const groupid = await addGroup({ client, succeed: true, tripid, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });

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

    describe("Groups", () => {
      test("Can invite other users to group", async () => {
        // Create entity & trip
        const tripid = await addTrip({ client, succeed: true });
        // Create a group for friend
        const groupid = await addGroup({ client, succeed: true, tripid, user_id: user_id2 });
        await acceptGroup({ client: client2, groupid, succeed: true });
      });

      test("Can't set accepted=true for others", async () => {
        // Create entity & trip
        const tripid = await addTrip({ client, succeed: true });
        // Create a group for friend (error because it's automatically set as accepted)
        await create({
          client,
          table: "groups",
          params: { trip_id: tripid, user_id: user_id2, accepted: true },
          succeed: false,
        });
        // Create group for real with accepted=false (default)
        const groupid = await addGroup({ client, succeed: true, tripid, user_id: user_id2 });
        // Client1 can't accept the invite
        await acceptGroup({ client, groupid, succeed: false });
      });

      test("Can't access the trip until accepted=true", async () => {
        // Create entity & trip
        const tripid = await addTrip({ client, succeed: true });
        // Client2 can't access
        await create({
          client: client2,
          table: "entities",
          params: { trip_id: tripid, parent: tripid },
          succeed: false,
        });
        // Create a group for client2
        const groupid = await addGroup({ client, succeed: true, tripid, user_id: user_id2 });
        // Client2 still can't access because he hasn't accepted
        await create({
          client: client2,
          table: "entities",
          params: { trip_id: tripid, parent: tripid },
          succeed: false,
        });
        // Client2 accepts invite
        await acceptGroup({ client: client2, groupid, succeed: true });
        // Client2 can now access
        await create({
          client: client2,
          table: "entities",
          params: { trip_id: tripid, parent: tripid },
          succeed: true,
        });
      });
    });
  });
}
