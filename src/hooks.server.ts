import Pocketbase from 'pocketbase';
import { PB_URL } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

export const authentication: Handle = async ({ event, resolve }) => {
	event.locals.pb = new Pocketbase(PB_URL);
	try {
		event.locals.pb_providers = (
			await event.locals.pb.collection('users').listAuthMethods()
		).oauth2.providers;
	} catch (error) {
		console.error(error);
		event.locals.pb_providers = [];
	}

	//load authStore data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		//get latest authStore state by refreshing the loaded auth model.
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh();
		}
	} catch (error) {
		console.error(error);
		//clear the auth store on failed refresh.
		event.locals.pb.authStore.clear();
	}

	const response = await resolve(event);

	// Send back the default 'pb_auth' cookie to client with latest store state.
	response.headers.append(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ sameSite: 'Lax' })
	);

	return response;
};

const unprotectedPrefix = ['/login', '/register', '/auth', '/verify'];

export const authorization: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname;
	// protect routes
	if (pathname !== '/' && !unprotectedPrefix.some((path) => pathname.startsWith(path))) {
		const loggedIn = await event.locals.pb.authStore.record;
		const verified = await event.locals.pb.authStore.record?.verified;
		if (!loggedIn) {
			throw redirect(303, '/login');
		}
		if (!verified && loggedIn) {
			throw redirect(303, '/verify');
		}
	}
	return await resolve(event);
};

export const handle = sequence(authentication, authorization);
