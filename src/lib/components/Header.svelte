<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate, goto } from '$app/navigation';
	import { toast } from '@zerodevx/svelte-toast';

	export let user: any;

	const logout = async () => {
		await $page.data.supabase.auth.signOut();
		invalidate('supabase:auth');
		setTimeout(() => goto('/'), 0);
		toast.push('Déconnexion réussie', {
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
	};
</script>

<header>
	{#if user}
		<section class="admin__bar">
			<div class="container">
				<div class="admin__bar-left">
					<p>Bonjour {user.email}</p>
				</div>
				<div class="admin__bar-right">
					<a class="admin__link" href="/">Voir le site client</a>
					<a class="admin__link" href="/admin">Administration</a>
					<button on:click={logout}>Déconnexion</button>
				</div>
			</div>
		</section>
	{/if}
	<div class="container">
		<a href="/" class="header__logo"><img src="/assets/norma-logo.png" alt="logo" /></a>
		{#if user}
			<div class="btn__container">
				<a href={`/admin`} class="btn">Dashboard</a>
			</div>
		{:else}
			<div class="btn__container">
				<a class="btn" href="/">Accueil</a>
				<a class="btn" href="/contact">Contact</a>
			</div>
		{/if}
	</div>
</header>

<style lang="scss">
	header {
		flex-direction: column;
	}
	.admin__bar {
		background-color: black;
		height: 3rem;
		width: 100%;
		display: flex;
		align-items: center;

		.container {
			justify-content: flex-start;
		}

		p,
		a {
			color: #fff;
			font-size: 1.4rem;
			line-height: 1.96rem;
			font-family: 'Lucida Sans', sans-serif;
			padding: 0.5rem;
		}
		a {
			font-weight: bold;
			transition: 0.3s ease-in-out;
			&:hover {
				opacity: 0.8;
			}
		}
	}
	.admin__bar-left,
	.admin__bar-right {
		display: flex;
		width: 100%;
	}

	.admin__bar-right {
		justify-content: flex-end;
		gap: 1rem;

		button {
			background: none;
			color: white;
			border: none;
			font-weight: bold;
			cursor: pointer;
			&:hover {
				background-color: #ffb500;
			}
		}
	}
</style>
