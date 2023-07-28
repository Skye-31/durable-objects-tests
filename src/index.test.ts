import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll, assert } from "vitest";

describe("Worker", () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.ts", {
			experimental: { disableExperimentalWarning: true }
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return Hello World", async () => {
		const req1 = await worker.fetch();
		assert(req1);

		const text = await req1.text();
		expect(text).toMatchInlineSnapshot(`
			"This is the first request, we called the constructor, so this.location was null.<br />
			We will set this.location to be your city: (Austin). Try <strong onclick=\\"window.location.reload()\\">reloading the page</strong>."
		`);
		expect(req1.status).toBe(200);
		expect(Object.fromEntries(req1.headers.entries())).toMatchInlineSnapshot(`
			{
			  "content-length": "215",
			  "content-type": "text/html",
			}
		`);

		const req2 = await worker.fetch();
		assert(req2);

		const text2 = await req2.text();
		expect(text2).toMatchInlineSnapshot(`
			"The Durable Object was already loaded and running because it recently handled a request.<br />
			Previous Location: Austin<br />
			New Location: Austin"
		`);
		expect(req2.status).toBe(200);
		expect(Object.fromEntries(req2.headers.entries())).toMatchInlineSnapshot(`
			{
			  "content-length": "147",
			  "content-type": "text/html",
			}
		`);
	});
});
