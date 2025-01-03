import type { LayoutServerLoad } from './$types';
import { serializeNonPOJOs } from '$lib/utils';

export const load = (async ({ locals }) => {
	const user = locals.pb.authStore.record;
	return { user: serializeNonPOJOs(user) };
}) satisfies LayoutServerLoad;
