import type { PageServerLoad } from './$types';
import { serializeNonPOJOs } from '$lib/utils';

export const load = (async ({ locals }) => {
	const user = locals.pb.authStore.record;
    console.log(serializeNonPOJOs(user))
	return { user: serializeNonPOJOs(user) };
}) satisfies PageServerLoad;
