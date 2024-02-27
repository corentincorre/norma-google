import { fail, redirect } from '@sveltejs/kit';
import { Level, Role, State } from '$lib/types/norma';
import type { Database } from '../../../../types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

type Dancer = Database['public']['Tables']['dancers']['Row'];
type NormaDatabase = SupabaseClient<Database>;

interface RegistrationFormData {
	email: string;
	level: Level;
	role: Role;
	partnaire_email: string | undefined;
}

function formDataToRegistration(formData: FormData): RegistrationFormData {
	const email = formData.get('email');
	if (!email) {
		throw new Error('Adresse email manquante');
	}
	if (typeof email !== 'string') {
		throw new Error('Adresse email devrait être une chaîne de caractère');
	}
	const levelstr = formData.get('level');
	let level: number;
	if (!levelstr) {
		throw new Error('Niveau du danceur manquant');
	}
	if (typeof levelstr !== 'string') {
		throw new Error('Le niveau du danceur devrait être une chaîne de caractère');
	} else {
		level = parseInt(levelstr);
		if (!(level === Level.Débutant || level === Level.Confirmé || level === Level.Expert)) {
			throw new Error("Le niveau du danceur n'est pas reconnu " + levelstr);
		}
	}
	const rolestr = formData.get('role');
	let role: number;
	if (!rolestr) {
		throw new Error('Rôle du danceur manquant');
	}
	if (typeof rolestr !== 'string') {
		throw new Error('Le rôle du danceur devrait être une chaîne de caractère');
	} else {
		role = parseInt(rolestr);
		if (!(role === Role.Leader || role === Role.Suiveur)) {
			throw new Error("Le rôle du danceur n'est pas reconnu " + rolestr);
		}
	}
	const partnaire_email = formData.get('partnaire_email') || undefined;
	if (email === partnaire_email) {
		throw new Error("L'adresse mail de danceur ne doit pas être la même que celle du partenaire");
	}
	if (partnaire_email && typeof partnaire_email !== 'string') {
		throw new Error(" L'adresse email du partenaire devrait être une chaîne de caractère");
	}

	return {
		email,
		level,
		role,
		partnaire_email
	};
}

export const actions = {
	default: async ({ params, request, locals: { supabase } }) => {
		const formData = await request.formData();
		let registrationData;
		try {
			registrationData = formDataToRegistration(formData);
		} catch (error) {
			return fail(400, {
				error
			});
		}
		const { level, partnaire_email, role } = registrationData;

		//@ts-expect-error Supabase est mal typé
		let { data: registrationCount }: { data: number } = await supabase
			.from('dancers')
			.select('*(count)')
			.eq('event', params.slug)
			.or('state.eq.' + State.Inscrit + ',state.eq.' + State['Règlement en cours']);
		let url = '';

		if (!Number.isSafeInteger(registrationCount)) {
			registrationCount = 0;
		}
		if (registrationCount >= 50) {
			url = await register(params, registrationData, supabase, State.Attente);
		}
		const check_role = await checkRole(params.slug, role, level, supabase);

		if (check_role) {
			if (partnaire_email) {
				const { data: partenaire, error: partenaireError } = await supabase
					.from('dancers')
					.select()
					.eq('event', params.slug)
					.eq('email', partnaire_email);
				if (partenaireError) {
					return fail(400, {
						error: 'Erreur lors de la recherche du partenaire renseigné'
					});
				}
				if (partenaire[0]) {
					if (partenaire[0].state === State.Attente) {
						//envoi auto mail pour payer
						setDancerOrderWaiting(params, partnaire_email, supabase);
					}
				} else {
					// throw new Error('TODO : sendInvitationMail(partnaire_email);');
				}
			}
			url = await register(params, registrationData, supabase, State['Règlement en cours']);
		} else {
			if (partnaire_email) {
				const { data: partenaire } = await supabase
					.from('dancers')
					.select()
					.eq('event', params.slug)
					.eq('email', partnaire_email);

				if (partenaire && partenaire[0]) {
					if (partenaire[0].state === State.Inscrit) {
						url = await register(params, registrationData, supabase, State['Règlement en cours']);
					}
				} else {
					throw new Error('TODO : sendInvitationMail(partnaire_email);');
				}
			}
			url = await register(params, registrationData, supabase, State.Attente);
		}
		if (url) {
			redirect(302, url);
		} else {
			return fail(400, {
				error: 'Erreur'
			});
		}
	}
};

async function checkRole(event: string, role: Role, level: Level, supabase: NormaDatabase) {
	//@ts-expect-error Supabase est mal typé
	const { data: selectedCount }: { data: number } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('event', event)
		.eq('role', role)
		.eq('level', level);

	//@ts-expect-error Supabase est mal typé
	const { data: oppositeCount }: { data: number } = await supabase
		.from('dancers')
		.select('*(count)')
		.eq('role', role === Role.Leader ? Role.Suiveur : Role.Leader)
		.eq('level', level);

	return selectedCount <= oppositeCount + 2;
}

async function register(
	params: { slug: string },
	registrationData: RegistrationFormData,
	supabase: NormaDatabase,
	state: State
): Promise<string> {
	const { email, level, role } = registrationData;
	const { partnaire_email } = registrationData;

	const { data: alreadyExist }: { data: Dancer | null } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug)
		.maybeSingle();

	if (alreadyExist) {
		const alreadyExistUser = alreadyExist;
		const state: State = alreadyExistUser.state;
		switch (state) {
			case State['Règlement en cours']:
				return '/events/' + params.slug + '/commande';
			case State.Inscrit:
				return '/events/' + params.slug + '/confirmation';
			case State['Attente']:
				return '/events/' + params.slug + '/reservation';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}

	const { error: insertError } = await supabase.from('dancers').insert({
		email: email,
		state: state,
		role: role,
		level: level,
		event: params.slug
	});
	if (partnaire_email) {
		const oppositeRole = role === Role.Leader ? Role.Suiveur : Role.Leader;
		const { error: insertPartnerError } = await supabase.from('dancers').insert({
			email: partnaire_email,
			state: state,
			role: oppositeRole,
			level: level,
			event: params.slug
		});
		dancerIdAttribution(email, partnaire_email, supabase, params);
		if (insertPartnerError) {
			throw new Error("Erreur lors de l'enregistrement");
		}
	}
	if (insertError) {
		throw new Error("Erreur lors de l'enregistrement");
	}
	switch (state) {
		case State['Règlement en cours']:
			return '/events/' + params.slug + '/commande';
		case State.Attente:
			return '/events/' + params.slug + '/reservation';
		case State.Inscrit:
			throw new Error(`L'utilisateur ne devrait pas être inscrit`);
		default:
			const exhaustiveCheck: never = state;
			throw new Error(`Unhandled state: ${exhaustiveCheck}`);
	}
}

// function sendInvitationMail(email) {

// }

async function setDancerOrderWaiting(
	params: { slug: string },
	partnaire_email: string,
	supabase: NormaDatabase
) {
	const { error } = await supabase
		.from('dancers')
		.update({ state: State['Règlement en cours'] })
		.eq('email', partnaire_email)
		.eq('event', params.slug);
	if (!error) {
		throw new Error('TODO : send mail auto pour payer');
	}
}

// Récupère les id du danceur et de son partenaire afin de les relier entre eux dans la BD
async function dancerIdAttribution(
	email: string,
	partner_email: string,
	supabase: NormaDatabase,
	params: { slug: string }
) {
	// Sélection du danseur principal
	const { data: dancer } = await supabase
		.from('dancers')
		.select()
		.eq('email', email)
		.eq('event', params.slug)
		.maybeSingle();

	// Mise à jour de l'ID du partenaire pour le danseur principal
	if (dancer?.id) {
		await updatePartnerId(supabase, partner_email, params.slug, dancer.id);
	}

	// Sélection du partenaire
	const { data: dancerPartner } = await supabase
		.from('dancers')
		.select()
		.eq('email', partner_email)
		.eq('event', params.slug)
		.maybeSingle();

	// Mise à jour de l'ID du partenaire pour le partenaire
	if (dancerPartner?.id) {
		await updatePartnerId(supabase, email, params.slug, dancerPartner.id);
	}
}
async function updatePartnerId(
	supabase: NormaDatabase,
	email: string,
	enventSlug: string,
	partnerId: number
) {
	await supabase
		.from('dancers')
		.update({ partner_id: partnerId })
		.eq('email', email)
		.eq('event', enventSlug);
}
