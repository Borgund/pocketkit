import { fail, redirect } from '@sveltejs/kit';
import { REDIRECT_URL } from '$env/static/private';
import type { PageServerLoad, Actions } from './$types';
import { ClientResponseError } from 'pocketbase';

export const load = (async ({ locals, url }) => {
	if (locals.pb.authStore.record) {
		return redirect(303, '/dashboard');
	}

	const authMethods = await locals.pb_providers; //await locals.pb.collection('users').listAuthMethods();
	const fail = url.searchParams.get('fail') === 'true';

	return { providers: authMethods, fail, time: Date.now()};
}) satisfies PageServerLoad;

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString();
		const password = data.get('password')?.toString();

		if (!email || !password) {
			return fail(400, {
				email,
				emailRequired: !email,
				passwordRequired: !password
			});
		}
		// setting password comfirm to exclude it from the login form (remove if implemented in form).
		data.set('passwordConfirm', password?.toString());
		try {
			const userCollection = locals.pb.collection('users');
			await userCollection.create(data);
			await userCollection.authWithPassword(email, password);
			await userCollection.requestVerification(email);
		} catch (error) {
			console.error(error);
			const errorObj = error as ClientResponseError;
			return fail(500, { fail: true, message: errorObj.data.message });
		}

		throw redirect(303, '/verify');
	},
	login: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, {
				email,
				emailRequired: !email,
				passwordRequired: !password
			});
		}

		try {
			await locals.pb.collection('users').authWithPassword(email.toString(), password.toString());
		} catch (error) {
			console.error(error);
			const errorObj = error as ClientResponseError;
			return fail(500, { fail: true, message: errorObj.data.message });
		}

		throw redirect(303, '/dashboard');
	},
	reset: async ({ locals, request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString() ?? '';

		if (!email) {
			return fail(400, { email, emailRequired: !email });
		}

		try {
			await locals.pb.collection('users').requestPasswordReset(email.toString());
		} catch (error) {
			console.error(error);
			const errorObj = error as ClientResponseError;
			return fail(500, { fail: true, message: errorObj.data.message });
		}
		return { passwordReset: true, resetTime: Date.now() };
	},
	oauth: async ({ locals, request, cookies }) => {
		const providerName = new URL(request.url).searchParams.get('provider');
		const provider = locals.pb_providers.find((provider) => provider.name === providerName);
		if (provider) {
			cookies.set('provider', JSON.stringify(provider), {
				httpOnly: true,
				path: `/auth/callback/${provider.name}`
			});
			throw redirect(303, provider.authURL + REDIRECT_URL + provider.name);
		}
	},
	logout: async ({ locals }) => {
		await locals.pb.authStore.clear();
		throw redirect(303, '/login');
	}
	//actionname: async ({ locals, request }) => {}
};
