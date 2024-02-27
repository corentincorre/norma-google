<script lang="ts">
	import { onMount } from 'svelte';
	export let data;
	let todayDate = new Date();
	let archivedEvents: Array<any> = [];
	let events: any;

	if (Array.isArray(data.events)) {
		events = data.events.filter((event) => {
			if (new Date(event.endDate) < todayDate) {
				archivedEvents.push(event);
				return false;
			}
			return true;
		});
	} else {
		console.error('data.events is not an array');
	}

	onMount(() => {
		const links = document.querySelectorAll('.admin__link');
		links.forEach((link) => {
			link.addEventListener('click', () => {
				links.forEach((link) => link.classList.remove('activLink'));
				link.classList.add('activLink');
			});
		});
	});
</script>

<div class="header-container">
	<h1>Les événements actuels</h1>
</div>

<ul class="events-list">
	{#each events as event}
		<li class="event">
			<a href="/events/{event.formSlug}" class="card">
				<div class="card__img">
					<div class="event__item">
						<div>
							{#if event.logo}<img
									src={event.logo.publicUrl}
									alt={event.title}
									class="event-img"
								/>{/if}
						</div>
						<div class="card__content">
							<h2>{event.title}</h2>
							<p>{event.description}</p>
							<div class="btn__container">
								<a href="/events/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>

<div class="separator"></div>

<div class="header-container">
	<h2>Les événements terminés</h2>
</div>

<ul class="events-list events-archived">
	{#each archivedEvents as event}
		<li class="event">
			<a href="/archive/{event.formSlug}" class="card">
				<div class="card__img">
					<div class="event__item">
						<div>
							{#if event.logo}<img
									src={event.logo.publicUrl}
									alt={event.title}
									class="event-img"
								/>{/if}
						</div>
						<div class="card__content">
							<h2>{event.title}</h2>
							<p>{event.description}</p>
							<div class="btn__container">
								<a href="/archive/{event.formSlug}" class="btn">Voir</a>
							</div>
						</div>
					</div>
				</div>
			</a>
		</li>
	{/each}
</ul>
