<script>
	export let data;
	const event = data.event;
</script>

<section class="event__container">
	<div class="wrapper">
		<div class="card__img">
			<div>
				<div>
					{#if event.logo}
						<img src={event.logo.publicUrl} alt={`Logo de ${event.title}`} />
					{/if}
				</div>
				<div>
					<h1>{event.title}</h1>
					<p>Type de l'événement : {event.activityType}</p>
					<p>{event.description}</p>
					<h2>Prix :</h2>
					<ul>
						{#each event.tiers as price}
							<li>{price.label} : {(price.price / 100).toFixed(2).replace('.', ',')} €</li>
						{/each}
					</ul>
				</div>
				<div class="btn__container">
					<a class="btn" href="/events/{event.formSlug}/register">S'inscrire</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	.event__container {
		img {
			width: 100%;
			height: 300px;
			object-fit: cover;
		}
		h1 {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}
	}
</style>
