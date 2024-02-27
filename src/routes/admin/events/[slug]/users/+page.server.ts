export async function load({ locals, params }) {
	const { data: users, error } = await locals.supabase.from('dancers').select('*');

	if (error) {
		console.error('Error fetching users', error);
		return { users: [] };
	}

	const eventNameFromUrl = params.slug;

	const filteredUsers = users.filter((user) => user.event === eventNameFromUrl);

	return {
		users: filteredUsers,
		enventName: eventNameFromUrl
	};
}
