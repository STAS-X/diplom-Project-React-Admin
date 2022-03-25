const fetch_data = async (data) => {
	try {
		if (data.type === 'remove') {
			const response = await fetch(`/remove/${data.note.id}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				redirect: 'follow',
			});
			if (response.ok) {
				const body = await response.json();
				if (body.status === 'completed') {
					document.querySelector(`li[data-id="${data.note.id}"]`).remove();
					console.log(`Note ${data.note.id} removed success`);
					if (body.isEmpty) {
						document.querySelector(`div[data-type="empty"]`).hidden = false;
					} else {
						document.querySelector(`div[data-type="empty"]`).hidden = true;
					}
				} else console.log(`Error`);
			}
			setAlertMessage(true, false, false, true, data.note.id);
			//window.location.href = `/remove/${data.note.id}`;
		} else if (data.type === 'create') {
			const response = await fetch(`/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: JSON.stringify({ ...data.note }),
				redirect: 'follow',
			});
			if (response.ok) {
				const body = await response.json();
				if (body.status === 'completed') {
					console.log(`Note ${data.note.id} created success`);
				} else console.log(`Error`);
			}
			setAlertMessage(true, true, false, false, data.note.id);
			//window.location.href = `/remove/${data.note.id}`;
		} else {
			const newTitle = document.querySelector(
				`input[data-type="edit-title"][data-id="${data.note.id}"]`
			).value;
			if (newTitle && newTitle !== data.note.title) {
				const response = await fetch(`/edit/${data.note.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						// 'Content-Type': 'application/x-www-form-urlencoded',
					},
					redirect: 'follow',
					body: JSON.stringify({ ...data.note, title: newTitle }),
				});

				if (response.ok) {
					const body = await response.json();
					if (body.status === 'completed') {
						document.querySelector(
							`li[data-id="${data.note.id}"] > div[data-type="show"] > span`
						).innerHTML = `Title - ${newTitle} <br/> TimeStamp - ${data.note.id}`;
						document.querySelector(
							`input[data-type='edit-title'][data-id='${data.note.id}']`
						).dataset.oldvalue=newTitle;
						console.log(`Note ${data.note.id} edited success`);
					} else console.error(`Error`);
				}
				setAlertMessage(true, false, true, false, data.note.id);
				//window.location.href = `/edit/${data.note.id}`;
			} else
				console.error(
					'Title must have least one symbol and differ from source'
				);
		}
	} catch (error) {
		console.error('Ошибка:', error);
	}
};

const setAlertMessage = (alerted, created, edited, removed, id) => {
	if (alerted) {
		initAlertElement(created, edited, removed, id);
		const alertNode = document.querySelector('[data-id="post-alert"]');
		const alertBoot = bootstrap.Alert.getOrCreateInstance(alertNode);

		if (!created) {
			if (window.history.replaceState) {
				window.history.pushState({}, null, '/');
			}
		}

		if (edited && id) {
			document
				.querySelector(`button[data-type="edit"][data-id="${id}"]`)
				.classList.toggle('btn-success');
			setTimeout(() => {
				document
					.querySelector(`button[data-type="edit"][data-id="${id}"]`)
					.classList.toggle('btn-success');
			}, 1500);
		}

		if (document.querySelector('input[name="title"]'))
			document.querySelector('input[name="title"]').focus();

		alertNode.addEventListener('closed.bs.alert', () => {
			if (document.querySelector('input[name="title"]'))
				document.querySelector('input[name="title"]').focus();
			alertBoot.dispose();
		});
		setTimeout(
			(alert) => {
				if (document.querySelector('[data-id="post-alert"]')) {
					alert.close();
				}
			},
			3000,
			alertBoot
		);
	}
};

const initAlertElement = (created, edited, removed, id) => {
	document.body.insertAdjacentHTML(
		'afterbegin',
		`<div
			class="alert ${
				created ? 'alert-success' : removed ? 'alert-warning' : 'alert-info'
			} alert-dismissible fade show"
			data-id="post-alert"
		>
			<svg
				class="bi flex-shrink-0 me-2"
				width="24"
				height="24"
				role="img"
				aria-label="${created ? 'Success:' : removed ? 'Warning:' : 'Info:'}"
			>
				<use
					xlink:href="${
						created
							? '#check-circle-fill'
							: removed
							? '#exclamation-triangle-fill'
							: '#info-fill'
					}"
				/>
			</svg>
            ${
							created
								? 'Note was added!'
								: removed
								? 'Note was deleted!'
								: edited
								? 'Note was edited!'
								: 'Action not completed'
						}
			<button
				type="button"
				class="btn-close"
				data-bs-dismiss="alert"
				aria-label="Close"
			></button>
		</div>`
	);
};

const toggleEditShowDiv = (id) => {
	document.querySelector(`div[data-type='show'][data-id='${id}']`).hidden = !document.querySelector(`div[data-type='show'][data-id='${id}']`).hidden;
	document.querySelector(`div[data-type='edit'][data-id='${id}']`).hidden = !document.querySelector(`div[data-type='edit'][data-id='${id}']`).hidden;
};

