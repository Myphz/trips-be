import policiesTest from "./policies.test";
import selectTest from "./select.test";
import updateTest from "./update.test";
import deleteTest from "./delete.test";
import photosTest from "./photos.test";
import createTest from "./create.test";
import { describe } from "node:test";
import { cleaner } from "./utils";

describe("Tests", () => {
  cleaner();

  policiesTest();
  selectTest();
  updateTest();
  deleteTest();
  photosTest();
  createTest();
});
