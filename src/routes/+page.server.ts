import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ fetch }) {
	const events = await fetch(
		'https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event',
		{
			method: 'GET',
			headers: {
				authorization: 'Bearer ' + get(access_token)
			}
		}
	).then((resp) => resp.json());
	return {
		events: events.data
	};
}

export const actions = {
	default: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error('Error logging out:', error);
			return { status: 500, errors: { message: 'Logout failed' } };
		}
		return {
			status: 200,
			body: { message: 'Logout successful' }
		};
	}
};
