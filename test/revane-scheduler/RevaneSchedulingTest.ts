import test from "ava";
import { join } from "node:path";
import RevaneIOC, {
  Options,
  SchedulingExtension,
} from "../../src/revane-ioc/RevaneIOC.js";
import { SchedulerLoader } from "../../src/revane-scheduler/SchedulerLoader.js";
import { TaskScheduler } from "../../src/revane-scheduler/TaskScheduler.js";
import SchedulerInvalid1 from "../../testdata/scheduler-invalid1/SchedulerInvalid1.js";
import SchedulerInvalid2 from "../../testdata/scheduler-invalid2/SchedulerInvalid2.js";
import SchedulerInvalid3 from "../../testdata/scheduler-invalid3/SchedulerInvalid3.js";
import SchedulerThrowing1 from "../../testdata/scheduler-throws/SchedulerThrowing1.js";
import SchedulingErrorhandler1 from "../../testdata/scheduler-throws/SchedulingErrorhandler1.js";
import SchedulerThrowing2 from "../../testdata/scheduler-throws2/SchedulerThrowing2.js";
import SchedulerThrowing3 from "../../testdata/scheduler-throws3/SchedulerThrowing3.js";
import SchedulingErrorhandler3 from "../../testdata/scheduler-throws3/SchedulingErrorhandler3.js";
import Scheduler1 from "../../testdata/scheduler/Scheduler1.js";
import Scheduler2 from "../../testdata/scheduler2/Scheduler2.js";
import { beanDefinition, MockedExtension } from "../MockedLoader.js";

test("Should schedule task", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler"),
    [
      new MockedExtension([beanDefinition("scan56", Scheduler1)]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  await wait();
  await revane.close();
  t.true((await revane.get("scan56")).executed);
  await revane.close();
});

test("Should schedule task enabled via extension options", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler2"),
    [
      new MockedExtension([beanDefinition("scan56", Scheduler2)]),
      new SchedulingExtension({ enabled: true }),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();

  await wait();
  t.true((await revane.get("scan56")).executed);
  await revane.close();
});

test("Should schedule task #2", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-invalid1"),
    [
      new MockedExtension([beanDefinition("scan56", SchedulerInvalid1)]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-invalid1/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  try {
    await revane.initialize();
  } catch (error) {
    t.is(error.code, "REV_ERR_INVALID_CRON_PATTERN_PROVIDED");
  }
});

test("Should schedule task #3", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-invalid2"),
    [
      new MockedExtension([beanDefinition("scan56", SchedulerInvalid2)]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-invalid2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);

  try {
    await revane.initialize();
  } catch (error) {
    t.is(error.code, "REV_ERR_NO_CRON_PATTERN_PROVIDED");
  }
});

test("Should not schedule tasks", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-invalid3"),
    [
      new MockedExtension([beanDefinition("scan56", SchedulerInvalid3)]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-invalid3/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  await revane.close();
  t.pass();
});

test("Should handle error in scheduled task", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-throws"),
    [
      new MockedExtension([
        beanDefinition("scan56", SchedulerThrowing1),
        beanDefinition("errorHandler", SchedulingErrorhandler1, [
          "taskScheduler",
        ]),
      ]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-throws/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  await wait();
  const errorHandler = await revane.get("errorHandler");
  await revane.close();
  t.true(errorHandler.handledError);
});

test("Should handle error in scheduled async task", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-throws3"),
    [
      new MockedExtension([
        beanDefinition("scan56", SchedulerThrowing3),
        beanDefinition("errorHandler", SchedulingErrorhandler3, [
          "taskScheduler",
        ]),
      ]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-throws3/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  await wait();
  const errorHandler = await revane.get("errorHandler");
  await revane.close();
  t.true(errorHandler.handledError);
});

test("Should handle error in scheduled task with default handler", async (t) => {
  const options = new Options(
    join(import.meta.dirname, "../../testdata/scheduler-throws2"),
    [
      new MockedExtension([beanDefinition("scan56", SchedulerThrowing2)]),
      new SchedulingExtension(null),
    ],
  );
  options.loaderOptions = [];
  options.configuration = {
    disabled: false,
    directory: join(
      import.meta.dirname,
      "../../../testdata/scheduler-throws2/testconfig",
    ),
  };
  options.profile = "test";
  const revane = new RevaneIOC(options);
  await revane.initialize();
  await wait();
  await revane.close();
  t.pass();
});

test("schedulerLoader should return correct type", (t) => {
  const scheduler = new TaskScheduler();
  const loader = new SchedulerLoader(scheduler);

  scheduler.close();

  t.is(loader.type(), "taskScheduler");
});

async function wait(): Promise<void> {
  return await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}
