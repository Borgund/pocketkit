// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: import('pocketbase').default;
			pb_providers: import('pocketbase').AuthProviderInfo[];
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	interface ImportMetaEnv {
		PB_URL: string;
	}
}

export {};
