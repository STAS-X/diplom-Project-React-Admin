const express = require('express');
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs').promises;
//const path = require('path');
const {
	addNote,
	getNotes,
	updateNote,
	removeNotesByTimeStamp,
} = require('./notes.controller');

const options = {
	appTitle: 'Express App',
	id: '',
	async: true,
	isEmpty:false,
	alerted: false,
	created: false
};

const port = 3000;
//const basePath = path.join(__dirname, 'pages');
let noteRemoved = null;
let noteEdited = null;
let noteCreated = null;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '/src')));
app.use(express.static('src'));

// invoked for any requests passed to this router
app.use((req, res, next) => {
  // .. some logic here .. like any other middleware
  res.setHeader('X-Powered-By', 'STAS-X');
  next();
});

app.listen(port, () => {
	console.log(chalk.green(`Server has been started on port ${port}`));
});

app.param('id', (req, res, next, id) => {
	console.dir(
		'Middleware for ID params.',
		`Current identity ${id}`,
		`Method ${req.method}`,
		`Origin URL ${req.originalUrl}`
	);
	next();
});

/* Router pathname / */
app
	.route('/')
	.get(async (req, res, next) => {
		res.render(
			'index',
			{
				...options,
				notes: await getNotes(),
			},
			(err, html) => {
				if (err) {
					err.then((error) => next(error));
				} else if (html) {
					html.then((data) => {
						res.send(data);
						next(data);
					});
					
				} else {
					next(new Error('Failed to remove note by ID'));
				}
			}
		);
		//res.sendFile(path.join(basePath, 'index.html'));
	})
	.post(async (req, res, next) => {
		if (req.body) noteCreated = await addNote(req.body);
		res.render(
			'index',
			{
				...options,
				notes: await getNotes(),
				id: noteCreated ? noteCreated.id : '',
				alerted: noteCreated ? true : false,
				created: noteCreated ? true : false,
			},
			(err, html) => {
				if (err) {
					err.then((error) => next(error));
				} else if (html) {
					html.then((data) => {
						res.send(data);
						next(data);
					});
				} else {
					next(new Error('Failed to create note by Title'));
				}
			}
		);
		//res.sendFile(path.join(basePath, 'index.html'));
	});

/* Router /create/:title */
app.route('/create')
	.post(async (req, res) => {

	if (req.body) noteCreated = await addNote(req.body);

	if (noteCreated) res.status(200).json({ status: 'completed', id:noteCreated.id });
	else res.status(500).json({ status: 'error' });
});

/* Router /remove/:id */
app
	.route('/remove/:id')
	.delete(async (req, res) => {
		const { id } = req.params;
		if (id) noteRemoved = await removeNotesByTimeStamp(id);
		const notes = await getNotes();

		if (noteRemoved) res.status(200).json({ status: 'completed', isEmpty: notes.length === 0 });
		else res.status(500).json({ status: 'error' });
	})
	.get(async (req, res, next) => {
		res.render(
			'index',
			{
				...options,
				notes: await getNotes(),
				alerted: true,
				removed: noteRemoved ? true : false,
			},
			(err, html) => {
				if (err) {
					err.then((error) => next(error));
				} else if (html) {
					html.then((data) => {
						res.send(data);
						next(data);
					});
				} else {
					next(new Error('Failed to remove note by ID'));
				}
			}
		);
		noteRemoved = null;
	});

/* Router /edit/:id */
app
	.route('/edit/:id')
	.put(async (req, res) => {
		const editNote = req.body;

		if (editNote) noteEdited = await updateNote(editNote);
		if (noteEdited) res.status(200).json({ status: 'completed', id: noteEdited.id });
		else res.status(500).json({ status: 'error' });
	})
	.get(async (req, res, next) => {
		const { id } = req.params;

		res.render(
			'index',
			{
				...options,
				notes: await getNotes(),
				id,
				alerted: true,
				edited: noteEdited ? true : false,
			},
			(err, html) => {
				if (err) {
					err.then((error) => next(error));
				} else if (html) {
					html.then((data) => {
						res.send(data);
						next(data);
					});
				} else {
					next(new Error('Failed to remove note by ID'));
				}
			}
		);
		noteEdited = null;
	});

/* Roter for ALL pages */
app.get('*', (req, res) => {
	console.log('Stub for unknown pages');
	res.redirect('/');
});
