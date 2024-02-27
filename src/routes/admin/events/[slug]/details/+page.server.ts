import { access_token } from '$lib/server/accessToken';
import { get } from 'svelte/store';

export async function load({ params, fetch, locals }) {
	try {
		const slug = params.slug;

		const [events, event, orders] = await Promise.all([
			fetch(
				'https://api.helloasso.com/v5/organizations/norma-ecv/forms?pageIndex=1&pageSize=20&formTypes=event',
				{
					method: 'GET',
					headers: {
						authorization: 'Bearer ' + get(access_token)
					}
				}
			)
				.then((response) => response.json())
				.then((result) => result.data),

			fetch(
				'https://api.helloasso.com/v5/organizations/norma-ecv/forms/event/' + slug + '/public',
				{
					method: 'GET',
					headers: {
						authorization: 'Bearer ' + get(access_token)
					}
				}
			).then((response) => response.json()),

			fetch('https://api.helloasso.com/v5/organizations/norma-ecv/items', {
				method: 'GET',
				headers: {
					authorization: 'Bearer ' + get(access_token)
				}
			})
				.then((response) => response.json())
				.then((result) => result.data)
		]);

		const { data: dancers, error } = await locals.supabase.from('dancers').select('*');

		if (error) {
			console.error('Error fetching users from Supabase', error);
			return { event: [], dancers: [], orders: [] };
		}

		return {
			event,
			events,
			dancers,
			orders
		};
	} catch (error) {
		console.error('Error in load function', error);
	}
}
