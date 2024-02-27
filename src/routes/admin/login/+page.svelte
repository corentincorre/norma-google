<script lang="ts">
	import { enhance } from '$app/forms';

	export let form;
</script>

<div id="login__page" class="form__tpl">
	<h1>Connexion</h1>
	<form method="post" use:enhance>
		<div class="form-group">
			<label for="email">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				required
				aria-required="true"
				placeholder="Enter your email"
				class="form-control"
			/>
		</div>
		<div class="form-group">
			<label for="password">Mot de passe</label>
			<input
				type="password"
				name="password"
				id="password"
				required
				aria-required="true"
				placeholder="Enter your password"
				class="form-control"
			/>
		</div>
		<button type="submit" class="btn">Connexion</button>
	</form>
</div>
