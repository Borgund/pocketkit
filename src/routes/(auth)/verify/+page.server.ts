import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals, url }) => {
	const fail = url.searchParams.get('fail') === 'true';
	if (locals.pb.authStore.record?.verified) {
		console.log('HEY! What are you doing here!', locals.pb.authStore.record);
		redirect(303, '/dashboard');
	}

	return { fail };
}) satisfies PageServerLoad;

export const actions: Actions = {
	verify: async ({ locals }) => {
		try {
			const userEmail = locals.pb.authStore.record?.email;
			await locals.pb.collection('users').requestVerification(userEmail);
		} catch (error) {
			console.error(error);
			const errorObj = error as ClientResponseError;
			return fail(500, { fail: true, message: errorObj.data.message });
		}

		return { requestSent: true };
	},

	logout: async ({ locals }) => {
		await locals.pb.authStore.clear();
		throw redirect(303, '/login');
	}
	//actionname: async ({ locals, request }) => {}
};
