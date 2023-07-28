import { ok } from "node:assert";

export class MyDurableObject implements DurableObject {
	state: DurableObjectState;
	location: string | null;

	constructor(state: DurableObjectState) {
		this.state = state;
		// Upon construction, we do not have a location to provide.
		// This value will be updated as people access the Durable Object.
		// When the Durable Object is evicted from memory, this will be reset./**
		this.location = null;
	}

	// Handle HTTP requests from clients.
	async fetch(request: Request) {
		let response = null;

		ok(typeof request.cf?.city === "string");

		if (this.location == null) {
			response = `This is the first request, we called the constructor, so this.location was null.<br />
We will set this.location to be your city: (${request.cf.city}). Try <strong onclick="window.location.reload()">reloading the page</strong>.`;
		} else {
			response = `The Durable Object was already loaded and running because it recently handled a request.<br />
Previous Location: ${this.location}<br />
New Location: ${request.cf.city}`;
		}

		// We set the new location to be the new city.
		this.location = request.cf.city;
		return new Response(response, { headers: { "content-type": "text/html" } });
	}
}
