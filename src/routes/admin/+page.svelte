<script lang="ts">
	import { State, Role, Level } from '$lib/types/norma';

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
</script>

<div class="header-container">
	<h1>Vos derniers événements</h1>
</div>

<ul class="events-list">
	{#each events as event}
		<li class="event">
			<div class="event__item">
				<div>
					{#if event.logo}
						<div class="event-image-container">
							<img src={event.logo.publicUrl} alt={event.title} class="event-img" />
						</div>
					{/if}
				</div>
				<div class="card__content">
					<h2>{event.title}</h2>
					<p>{event.description}</p>
					<div class="btn__container">
						<a href="/admin/events/{event.formSlug}/users" class="btn">Voir les participants</a>
						<a href="/admin/events/adduser/{event.formSlug}" class="btn">Ajouter un participant</a>
						<a href="/admin/events/{event.formSlug}/details" class="btn">Détails</a>
					</div>
				</div>
			</div>
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
