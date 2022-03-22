const notes = [];
const fs = require('fs').promises;
const chalk = require('chalk');

const path = require('path');
const notesPath = path.join(__dirname, 'db.json');

async function saveNotes(notes) {
	await fs.writeFile(notesPath, JSON.stringify(notes));
}

async function addNote(title) {
	const notes = await getNotes();
	const note = {
		title,
		id: Date.now().toString(),
	};
	notes.push(note);
	await saveNotes(notes);
	await printNotes(notes.length);
}

async function getNotes() {
	const notes = JSON.parse(await fs.readFile(notesPath, { encoding: 'utf-8' }));
	return Array.isArray(notes) ? notes : [];
}

async function removeNotes(id) {
	const notes = await getNotes();
	if (notes.find((note, noteId) => noteId+1 === id)) {
		const newNotes = notes.filter((note, noteId) => noteId + 1 !== id);
		await saveNotes(newNotes);
		console.log(chalk.bgCyanBright(`Note №${id} was remove`));
	} else console.log(chalk.bgRedBright(`Note №${id} not found`));
}

async function printNotes(id) {
	const notes = await getNotes();
    if (!isNaN(id) && id>0 && id<=notes.length) {
        const note = notes.find((note, noteId) => noteId + 1 === id);
        console.log(chalk.blue(`Note №${id} has note [${note.title}] at ${note.id}`))
    } else {
			notes.forEach((note, id) =>
				console.log(
					chalk.blue(`Note №${id + 1} has note [${note.title}] at ${note.id}`)
				)
			);
		}
}

module.exports = {
	addNote,
	getNotes,
	removeNotes,
};
