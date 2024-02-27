<script lang="ts">
	import '../style/global.scss';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import Header from '$lib/components/Header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	export let data;

	$: ({ supabase } = data);
	$: user = data.user;

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== _session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

<Header {user} />
<SvelteToast />

<main class="container-column">
	<slot />
</main>

<style lang="scss">
</style>
