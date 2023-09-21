import { getFile } from "./telegram";

(async () => {
  const a = "BQACAgQAAx0EZIpFjgADCmT7PlviprN4dlal0uC-HJVyusbSAAKREwAC_krZUy55bhLqxivXMAQ";
  console.log(await getFile(a));
})();
