<script>
	import emailjs from '@emailjs/browser';
	import {
		PUBLIC_SERVICE_ID,
		PUBLIC_REGISTER_TEMPLATE_ID,
		PUBLIC_EMAILJS_KEY
	} from '$env/static/public';
	import { toast } from '@zerodevx/svelte-toast';

	function sendEmail(e) {
		emailjs
			.sendForm(PUBLIC_SERVICE_ID, PUBLIC_REGISTER_TEMPLATE_ID, e.target, PUBLIC_EMAILJS_KEY)
			.then(
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
	<h1>Envoyer une confirmation d'inscription à un utilisateur</h1>
	<form id="contact__form" on:submit|preventDefault={sendEmail}>
		<p>Envoyer la confirmationd 'inscription à l'utilisateur inscris</p>
		<label for="email" aria-label="Votre email">Email</label>
		<input
			name="email"
			placeholder="Votre email"
			type="email"
			required
			title="Merci d'entrer un email valide"
		/>
		<input class="submit__btn" type="submit" value="Envoyer" />
	</form>
</div>
