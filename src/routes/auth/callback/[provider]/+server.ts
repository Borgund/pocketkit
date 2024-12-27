import type { RequestHandler } from './$types';
import { REDIRECT_URL } from '$env/static/private';
import type { AuthProviderInfo } from 'pocketbase';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, cookies, url }) => {
	const provider: AuthProviderInfo = JSON.parse(cookies.get('provider') || '{}');
	if (provider.state !== url.searchParams.get('state')) {
		throw new Error('state parameters do not match');
	}
	try {
		await locals.pb
			.collection('users')
			.authWithOAuth2Code(
				provider.name,
				url.searchParams.get('code') || '',
				provider.codeVerifier,
				REDIRECT_URL + provider.name
			);
	} catch (error) {
		console.error(error);
		return redirect(303, '/login?fail=true');
	}
	throw redirect(303, '/login');
};
