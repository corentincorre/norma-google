import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ fetch }) {
	try {
		const { data: events, error } = await fetch(
			`https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event`,
			{
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + get(access_token)
				}
			}
		).then((res) => res.json());

		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { events: [], dancers: [], orders: [] };
		}

		return {
			events
		};
	} catch (error) {
		console.error('Error in load function', error);
		return { events: [], dancers: [] };
	}
}
