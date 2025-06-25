import bench from "fastbench";
import RevaneIOC, { Options } from '../src/revane-ioc/RevaneIOC.js'
import { join } from "node:path";

startup()

function startup() {
  return new Promise((resolve) => {
    console.log("\nStartup duration:\n");

    const run = bench(
      [
        function benchmarkStartup(cb) {
          const options = new Options(join(import.meta.dirname, "./app"), []);
          options.profile = "test";
          options.noRedefinition = true;
          const revane = new RevaneIOC(options);
          revane.initialize().then(() => {
            setImmediate(cb);
          })
        }
      ],
      100000,
    );
    run(resolve);
  });
}
