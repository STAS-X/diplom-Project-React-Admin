#!/usr/bin/env node
const yargs = require('yargs');
//const { hideBin } = require('yargs/helpers');
const pkg = require('./package.json');
const {
	addNote,
	getNotes,
	removeNotes,
	editNotes,
} = require('./notes.controller');
const chalk = require('chalk');

yargs.command({
	command: 'add',
	describe: 'Add new note to list',
	builder: {
		title: {
			type: 'string',
			describe: 'Note title',
			demandOption: true,
		},
	},
	handler({ title }) {
		//console.log(`Add command new title ${title}`);
		addNote(title);
	},
});

yargs.command({
	command: 'list',
	describe: 'Print all notes',
	builder: {
		id: {
			type: 'number',
			describe: 'List note by id',
			demandOption: false,
		},
	},
	async handler({ id }) {
		const notes = await getNotes();
		if (notes.length > 0) {
			if (!isNaN(id) && id > 0 && id <= notes.length) {
				const note = notes.find((note, noteId) => noteId + 1 === id);
				console.log(
					chalk.bgBlueBright(
						`Note №${id} has note [${note.title}] at ${note.id}`
					)
				);
			} else {
			notes.forEach((note, id) =>
				console.log(
					chalk.bgBlueBright(
						`Note №${id + 1} has note [${note.title}] at ${note.id}`
					)
				)
			);};
		} else console.log(chalk.bgGrey('Notes empty'));
	},
});

yargs.command({
	command: 'remove',
	describe: 'Remove note by id',
	builder: {
		id: {
			type: 'number',
			describe: 'Note id',
			demandOption: true,
		},
	},
	async handler({ id }) {
		removeNotes(id);
	},
});

yargs.command({
	command: 'edit',
	describe: 'Edit note by id',
	builder: {
		id: {
			type: 'string',
			describe: 'Note id',
			demandOption: true,
		},
		title: {
			type: 'string',
			describe: 'Note title',
			demandOption: true,
		},
	},
	async handler({ id, title }) {
		if (title) 
			editNotes(id, title);
		else
			console.error('Title cannot be empty');
	},
});

yargs.command({
	command: 'version',
	describe: 'Get packageJson version',
	handler() {
		console.log(`Current version is ${pkg.version}`);
	},
});

yargs.parse();
