import { json } from '@sveltejs/kit';

export async function DELETE({ locals, params }: any) {
	const { userId } = params;

	const { error } = await locals.supabase.from('dancers').delete().eq('id', userId);

	if (error) {
		return error(500, { message: "Erreur lors de la suppression de l'utilisateur" });
	}

	return json({ message: "L'utilisateur a été supprimé avec succès" });
}

export async function PATCH({ locals, request, params }) {
	const { userId } = params;
	const userData = await request.json();

	const { error } = await locals.supabase.from('dancers').update(userData).eq('id', userId);

	if (error) {
		throw error;
	}

	return json({ message: "L'utilisateur a été modifié avec succès" });
}
