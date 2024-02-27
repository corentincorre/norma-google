<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast';
	export let form;
	if (form?.error) {
		toast.push(form?.error, {
			theme: {
				'--toastBackground': '#cc210a',
				'--toastProgressBackground': '#d93c27',
				'--toastProgressAfterBackground': '#a5d6a7',
				'--toastColor': '#fff',
				'--toastProgressColor': '#fff',
				'--toastProgressAfterColor': '#fff'
			},
			duration: 1500
		});
	}
</script>

<svelte:head>
	<title>Mes informations complémentaires</title>
</svelte:head>
<div id="login__page" class="form__tpl">
	<h1>Renseignez-nous !</h1>
	<form action="register" method="post">
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				value=""
				required
				aria-required="true"
				placeholder="Enter your email"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="email">Email de votre partenaire</label>
			<input
				type="email"
				name="partnaire_email"
				id="email"
				value=""
				placeholder="Email de votre partenaire"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="role-select">Votre rôle :</label>
			<select name="role" id="role-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value="0">Leader</option>
				<option value="1">Suiveur</option>
			</select>
		</div>
		<div class="form-group">
			<label for="level-select">Votre niveau :</label>
			<select name="level" id="level-select" required>
				<option value="">--Veuillez choisir une option--</option>
				<option value="0">Débutant</option>
				<option value="1">Confirmé</option>
				<option value="2">Expert</option>
			</select>
		</div>
		<button type="submit">Poursuivre l'inscription</button>
	</form>
</div>
