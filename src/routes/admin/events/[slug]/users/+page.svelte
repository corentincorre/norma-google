<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Role, State } from '$lib/types/norma.js';
	import type { Database } from '../../../../../types/supabase';


	export let data;
	let users = data.users;
	let enventName = data.enventName;

	type Dancer = Database['public']['Tables']['dancers']['Row'];

	let searchTerm = '';
	let roleFilter: Role | undefined;
	let stateFilter: State | undefined;
	let sortColumn = '';
	let sortOrder = 1;
	let sortedUsers = users.slice();

	$: filteredUsers = sortedUsers.filter((user) => {
		const trimmedSearchTerm = searchTerm.trim().toLowerCase();
		const trimmedFullName = `${user.firstname} ${user.lastname}`.toLowerCase();

		const isSearchMatch = trimmedSearchTerm === '' || trimmedFullName.includes(trimmedSearchTerm);
		const isRoleMatch = roleFilter === undefined || user.role === roleFilter;
		const isStateMatch = stateFilter === undefined || user.state === stateFilter;

		return isSearchMatch && isRoleMatch && isStateMatch;
	});

	$: numberOfFilteredUsers = filteredUsers.length;

	function toggleSort(column: string) {
		if (column === sortColumn) {
			sortOrder *= -1;
		} else {
			sortOrder = 1;
			sortColumn = column;
		}

		if (column === 'created_at') {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const dateA = formatToFrenchDate(a.created_at);
				const dateB = formatToFrenchDate(b.created_at);
				const dateObjA = new Date(dateA);
				const dateObjB = new Date(dateB);
				const difference = dateObjA.getTime() - dateObjB.getTime();

				return sortOrder * difference;
			});
		} else {
			sortedUsers = filteredUsers.slice().sort((a, b) => {
				const valueA = column === 'role' ? a.role : a.state;
				const valueB = column === 'role' ? b.role : b.state;
				if (typeof valueA === 'number' && typeof valueB === 'number') {
					return sortOrder * (valueA - valueB);
				} else {
					return 0;
				}
			});
		}
	}

	function resetState() {
		searchTerm = '';
		roleFilter = undefined;
		stateFilter = undefined;
		sortColumn = '';
		sortOrder = 1;
		sortedUsers = users.slice();
	}

	function formatToFrenchDate(dateString: string) {
		const date = new Date(dateString);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	async function deleteUser(userToDelete: Dancer) {
		const confirmation = confirm(
			`Voulez-vous vraiment supprimer ${userToDelete.firstname} ${userToDelete.lastname}?`
		);

		if (confirmation) {
			try {
				const response = await fetch(`/admin/events/${enventName}/users/${userToDelete.id}`, {
					method: 'DELETE'
				});

				if (response.ok) {
					invalidate('/admin/events/${enventName}/users/').then(() => {
						location.reload();
					});
					alert(`L'utilisateur ${userToDelete.firstname} ${userToDelete.lastname} a été supprimé.`);
				} else {
					alert("Erreur lors de la suppression de l'utilisateur");
				}
			} catch (error) {
				console.error("Erreur lors de la suppression de l'utilisateur", error);
				alert("Erreur lors de la suppression de l'utilisateur");
			}
		}
	}
	function openUpdate(user: Dancer) {
		let updatePopup = document.querySelector(
			`.update__container[data-user-id="${user.id}"]`
		) as HTMLElement | null;

		if (updatePopup) {
			updatePopup.style.display = 'flex';

			const firstnameInput = updatePopup.querySelector<HTMLInputElement>('[name="firstname"]');
			if (firstnameInput) firstnameInput.value = user.firstname ?? '';

			const lastnameInput = updatePopup.querySelector<HTMLInputElement>('[name="lastname"]');
			if (lastnameInput) lastnameInput.value = user.lastname ?? '';

			const roleInput = updatePopup.querySelector<HTMLInputElement>('[name="role"]');
			if (roleInput) roleInput.value = user.role?.toString() ?? '';

			const stateInput = updatePopup.querySelector<HTMLInputElement>('[name="state"]');
			if (stateInput) stateInput.value = user.state?.toString() ?? '';

			const partnerInput = updatePopup.querySelector<HTMLInputElement>('[name="partner"]');
			if (partnerInput) partnerInput.value = user.partner_id?.toString() ?? '';
		}
	}

	function closeUpdate(userId: number) {
		let updatePopup = document.querySelector(
			`.update__container[data-user-id="${userId}"]`
		) as HTMLElement | null;

		if (updatePopup) {
			updatePopup.style.display = 'none';
		}
	}

	async function updateUser(userToUpdate: Dancer) {
		const confirmation = confirm(
			`Voulez-vous vraiment modifier les informations de ${userToUpdate.firstname} ${userToUpdate.lastname}?`
		);

		if (confirmation) {
			const form = document.querySelector(
				`.update__container[data-user-id="${userToUpdate.id}"] form`
			);
			//@ts-expect-error Form to handle
			const formData = new FormData(form);
			const userData = Object.fromEntries(formData.entries());
			try {
				const response = await fetch(`/admin/events/${enventName}/users/${userToUpdate.id}`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(userData)
				});

				if (response.ok) {
					invalidate('/admin/events/${enventName}/users/').then(() => {
						location.reload();
					});
					alert(`L'utilisateur ${userToUpdate.firstname} ${userToUpdate.lastname} a été modifié.`);
				} else {
					alert("Erreur lors de la modification de l'utilisateur");
				}
			} catch (error) {
				console.error("Erreur lors de la modification de l'utilisateur", error);
				alert("Erreur lors de la modification de l'utilisateur");
			}
		}
	}
	function mapRole(role: Role) {
		switch (role) {
			case Role.Leader:
				return 'Leader';
			case Role.Suiveur:
				return 'Suiveur';
			default:
				const exhaustiveCheck: never = role;
				throw new Error(`Unhandled role: ${exhaustiveCheck}`);
		}
	}

	function mapState(state: State) {
		switch (state) {
			case State['Règlement en cours']:
				return 'En attente de paiement';
			case State.Attente:
				return "Liste d'attente";
			case State.Inscrit:
				return 'Inscrit';
			default:
				const exhaustiveCheck: never = state;
				throw new Error(`Unhandled state: ${exhaustiveCheck}`);
		}
	}
</script>

<section class="users__container">
	<h1>Listes des participants</h1>
	{#if numberOfFilteredUsers === 1}
		<p>Il y a {numberOfFilteredUsers} participant trouvé</p>
	{:else if numberOfFilteredUsers > 1}
		<p>Il y a {numberOfFilteredUsers} participants trouvés</p>
	{:else}
		<p>Aucun participant trouvé</p>
	{/if}

	<div class="filters__container">
		<div class="search__container">
			<span class="search-icon">🔍</span>
			<input type="text" bind:value={searchTerm} placeholder="Rechercher un participant" />
		</div>
		<button on:click={resetState}>Réinitialiser</button>
	</div>

	<div class="filters__container__column">
		<div>
			<p>Filtrer par :</p>
		</div>
		<div class="filters__container">
			<select bind:value={roleFilter}>
				<option value={undefined}>--Choisir le rôle--</option>
				<option value={Role.Leader}>Leader</option>
				<option value={Role.Suiveur}>Suiveur</option>
			</select>
			<select bind:value={stateFilter}>
				<option value={undefined}>--Choisir l'état--</option>
				<option value={State.Inscrit}>Inscrit</option>
				<option value={State.Attente}>En attente</option>
				<option value={State['Règlement en cours']}>Reglement en cours</option>
			</select>
		</div>
	</div>
	<table>
		<thead>
			<tr>
				<th on:click={() => toggleSort('name')}>
					Nom
					<span class:desc={sortOrder === -1 && sortColumn === 'name'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('role')}>
					Rôle
					<span class:desc={sortOrder === -1 && sortColumn === 'role'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('state')}>
					État
					<span class:desc={sortOrder === -1 && sortColumn === 'state'} class="sort-icon"></span>
				</th>
				<th on:click={() => toggleSort('created_at')}>
					Inscrit le
					<span class:desc={sortOrder === -1 && sortColumn === 'created_at'} class="sort-icon"
					></span>
				</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if numberOfFilteredUsers === 0}
				<tr>
					<td colspan="5">Aucun utilisateur trouvé</td>
				</tr>
			{:else}
				{#each filteredUsers as user}
					<tr>
						{#if user.firstname && user.lastname}
							<td>{user.firstname} {user.lastname}</td>
						{:else}
							<td>{user.email}</td>
						{/if}
						<td>{mapRole(user.role)}</td>
						<td>{mapState(user.state)}</td>
						<td>{formatToFrenchDate(user.created_at)}</td>
						<td class="updateBtn">
							<button class="btn" on:click={() => openUpdate(user)}>Modifier</button>
							<button class="btn" on:click={() => deleteUser(user)}>Supprimer</button>
						</td>
					</tr>
					<div class="update__container" data-user-id={user.id}>
						<div class="update__header">
							<p>
								<strong>
									Mettre à jour {#if user.firstname && user.lastname}
										{user.firstname} {user.lastname}
									{:else}
										{user.email}
									{/if}</strong
								>
							</p>
						</div>
						<form id="updateUserForm">
							<label for="firstname">Prénom</label>
							<input type="text" name="firstname" disabled />
							<label for="lastname">Nom</label>
							<input type="text" name="lastname" disabled />
							<label for="role">Rôle</label>
							<select name="role">
								<option value="0">0 - Leader</option>
								<option value="1">1 - Suiveur</option>
							</select>
							<label for="state">État</label>
							<select name="state">
								<option value="0">0 - En attente de paiement</option>
								<option value="1">1 - Liste d'attente</option>
								<option value="2">2 - Inscrit</option>
							</select>
							<label for="partner">Partenaire</label>
							<input type="text" name="partner" disabled />
							<button type="button" on:click={() => updateUser(user)}>Mettre à jour</button>
							<button type="button" on:click={() => closeUpdate(user.id)}>Annuler</button>
						</form>
					</div>
				{/each}
			{/if}
		</tbody>
	</table>
</section>

<style lang="scss">
	.update__container {
		display: none;
		position: fixed;
		background-color: #fff;
		box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
		left: 50%;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		height: auto;
		width: 760px;
		top: 20%;
		border-radius: 12px;
		padding: 2rem;
		z-index: 100;
		flex-direction: column;
	}
	.update__header {
		display: flex;
		justify-content: space-between;
		width: 100%;

		p {
			padding: 0 2rem;
		}
	}
	td {
		button + button {
			margin-top: 1rem;
		}
	}
	@media (max-width: 768px) {
		.update__container {
			width: 90%;
		}
	}
</style>
