let tiny = require("tiny-json-http");
let test = require("tape");
let sandbox = require("@architect/sandbox");
let base = "http://localhost:3333";
let end;

// this starts a sandbox environment for the tests to excecute in.
test("start", async (t) => {
  t.plan(1);
  end = await sandbox.start();
  t.ok(true, "started");
});

test("post-api", async (t) => {
  t.plan(1);
  try {
    let result = await tiny.post({ url: `${base}` });
  } catch (err) {
    t.ok(err, "Unauthorized", console.log(err.statusCode));
  }
});

// this ends sandbox
test("end", async (t) => {
  t.plan(1);
  await sandbox.end();
  t.ok(true, "ended");
});
