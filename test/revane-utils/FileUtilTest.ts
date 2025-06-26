import test from "ava";
import { pathWithEnding } from "../../src/revane-utils/FileUtil.js";

test("should return correct path", (t) => {
  t.plan(7);
  const testCases = [
    { moduleName: "http", expectation: "http" },
    { moduleName: "path", expectation: "path" },
    { moduleName: "fs", expectation: "fs" },
    { moduleName: "crypto", expectation: "crypto" },
    { moduleName: "node:crypto", expectation: "node:crypto" },
    { moduleName: "file.js", expectation: "file.js" },
    { moduleName: "file", expectation: "file.js" },
  ];
  testCases.forEach(({ moduleName, expectation }) => {
    t.is(pathWithEnding(moduleName, ".js"), expectation);
  });
});
