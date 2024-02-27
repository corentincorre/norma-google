<script lang="ts">
	import { Role, State, Level } from '$lib/types/norma.js';

	export let data;
	$: event = data.event;
	$: orders = data.orders;
	let dancers = data.dancers;

	$: event.totalInscrit = dancers.filter(
		(dancer) => dancer.state === State.Inscrit && dancer.event === event.formSlug
	);

	$: event.reglement = dancers.filter(
		(dancer) => dancer.state === State['Règlement en cours'] && dancer.event === event.formSlug
	);

	$: event.attente = dancers.filter(
		(dancer) => dancer.state === State.Attente && dancer.event === event.formSlug
	);

	$: event.Débutant = event.totalInscrit.filter((dancer) => dancer.level === Level.Débutant);
	$: event.Confirmé = event.totalInscrit.filter((dancer) => dancer.level === Level.Confirmé);
	$: event.Expert = event.totalInscrit.filter((dancer) => dancer.level === Level.Expert);

	$: event.totalTicket = orders.filter((order) => order.order.formSlug === event.formSlug);

	$: event.typeOfTicketByEvent = event.totalTicket.map((order) => order.name);

	$: event.typeOfTicketByEvent = event.typeOfTicketByEvent.filter((value, index, self) => {
		return self.indexOf(value) === index;
	});
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
					<div class="fake-chart">
						<div class="stat-wrapper">
							<h3>Statistiques globales</h3>
							<p>
								Nombre de ticket vendus pour l'évènement : {event.totalTicket.length};
							</p>
							<p>
								Nombre total de danseurs inscrits : {event.totalInscrit.length}
							</p>
							<p>
								Nombre total en cours de règement : {event.reglement.length}
							</p>
							<p>
								Nombre total en file d'attente : {event.attente.length}
							</p>
						</div>
						<div class="stat-wrapper">
							<h3>Types de tickets vendus</h3>
							<ul>
								{#each event.typeOfTicketByEvent as ticket}
									<li>{ticket}</li>
								{/each}
							</ul>
						</div>
						<div class="stat-wrapper">
							<h3>Niveau des inscrits :</h3>
							<ul>
								<li>
									Débutant : Leader : {event.Débutant.filter(
										(dancer) => dancer.role === Role.Leader
									).length}, Suiveur : {event.Débutant.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
								<li>
									Confirmé : Leader : {event.Confirmé.filter(
										(dancer) => dancer.role === Role.Leader
									).length}, Suiveur : {event.Confirmé.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
								<li>
									Expert : Leader : {event.Expert.filter((dancer) => dancer.role === Role.Leader)
										.length}, Suiveur : {event.Expert.filter(
										(dancer) => dancer.role === Role.Suiveur
									).length}
								</li>
							</ul>
						</div>
					</div>
				</div>
				<p>Type de l'événement : {event.activityType}</p>
				<p>{event.description}</p>
				<div class="btn__container">
					<a
						href="https://admin.helloasso.com/{event.organizationSlug}/evenements/{event.formSlug}/edition/1"
						class="btn">Gérer</a
					>
					<a class="btn" href="/admin">Retour</a>
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
