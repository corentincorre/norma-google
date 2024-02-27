<script lang="ts">
	import emailjs from '@emailjs/browser';
	import {
		PUBLIC_SERVICE_ID,
		PUBLIC_CONTACT_TEMPLATE_ID,
		PUBLIC_EMAILJS_KEY
	} from '$env/static/public';
	import { toast } from '@zerodevx/svelte-toast';

	function sendEmail(e: SubmitEvent) {
		e.preventDefault();
		const form = e.target as HTMLFormElement;

		emailjs.sendForm(PUBLIC_SERVICE_ID, PUBLIC_CONTACT_TEMPLATE_ID, form, PUBLIC_EMAILJS_KEY).then(
			(result) => {
				result.text === 'OK' &&
					toast.push('Message envoyé avec succès!', {
						theme: {
							'--toastBackground': '#4caf50',
							'--toastProgressBackground': '#81c784',
							'--toastProgressAfterBackground': '#a5d6a7',
							'--toastColor': '#fff',
							'--toastProgressColor': '#fff',
							'--toastProgressAfterColor': '#fff'
						},
						duration: 1500
					});
			},
			(error) => {
				error.text &&
					toast.push("Erreur lors de l'envoi du message!", {
						theme: {
							'--toastBackground': '#f44336',
							'--toastProgressBackground': '#e57373',
							'--toastProgressAfterBackground': '#ef9a9a',
							'--toastColor': '#fff',
							'--toastProgressColor': '#fff',
							'--toastProgressAfterColor': '#fff'
						},
						duration: 1500
					});
			}
		);
	}
</script>

<div class="form__tpl">
	<h1>Contact</h1>
	<form id="contact__form" on:submit|preventDefault={sendEmail}>
		<label for="lastname" aria-label="Votre nom">Nom</label>
		<input
			name="lastname"
			type="text"
			required
			minlength="3"
			title="Merci d'entrer un nom valide"
			placeholder="Votre nom"
		/>
		<label for="firstname" aria-label="Votre prénom">Prénom</label>
		<input
			name="firstname"
			type="text"
			required
			minlength="3"
			title="Merci d'entrer un prénom valide"
			placeholder="Votre prénom"
		/>
		<label for="email" aria-label="Votre email">Email</label>
		<input
			name="email"
			placeholder="Votre email"
			type="email"
			required
			title="Merci d'entrer un email valide"
		/>
		<label for="message" aria-label="Votre message">Message</label>
		<textarea
			name="message"
			placeholder="Votre message"
			required
			minlength="10"
			title="Merci d'entrer un message valide"
		></textarea>
		<input class="submit__btn" type="submit" value="Envoyer" />
	</form>
</div>
