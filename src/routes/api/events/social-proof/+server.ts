import { addClient, removeClient } from '$lib/server/sse/social-proof';
import { produce } from 'sveltekit-sse';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = () => {
	let emitRef: ((event: string, data: string) => { error: false | Error }) | undefined;

	return produce(
		function start({ emit }) {
			emitRef = emit;
			addClient(emit);
		},
		{
			stop() {
				if (emitRef) removeClient(emitRef);
			}
		}
	);
};
