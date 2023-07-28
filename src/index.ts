export interface Env {
	DO: DurableObjectNamespace;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.url.includes("/favicon")) return new Response(null, { status: 404 });

		const id = env.DO.idFromName(new URL(request.url).pathname);
		const stub = env.DO.get(id);

		return stub.fetch(request);
	}
};

export { MyDurableObject } from "./durable-object";
