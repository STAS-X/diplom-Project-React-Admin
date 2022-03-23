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

const options={
		appTitle: 'Express App',
		id:'',
		alerted: false,
		removed: false,
		edited: false,
		created: false,
};
 
const port = 3000;
//const basePath = path.join(__dirname, 'pages');
let hasRemoved = false;
let hasEdited = false;
let hasCreated = false;

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(port, () => {
	console.log(chalk.green(`Server has been started on port ${port}`));
});

app.post('/', async (req, res) => {
	if (req.body) hasCreated = await addNote(req.body);
	res.render('index', {
		...options,
		notes: await getNotes(),
		alerted: true,
		created: hasCreated ? true : false,
	});
	//res.sendFile(path.join(basePath, 'index.html'));
});

app.delete('/remove/:id', async (req, res) => {
	const { id } = req.params;

	if (id) hasRemoved = await removeNotesByTimeStamp(id);

	if (hasRemoved) res.status(200).json({ status: 'completed' });
	else res.status(500).json({ status: 'error' });

});

app.put('/edit/:id', async (req, res) => {
	const editNote = req.body;

	if (editNote) hasEdited = await updateNote(editNote);

	if (hasEdited) res.status(200).json({ status: 'completed' });
	else res.status(500).json({ status: 'error' });
});

app.get('/', async (req, res) => {
	res.render('index', {
		...options,
		notes: await getNotes(),
	});
	//res.sendFile(path.join(basePath, 'index.html'));
});

app.get('/edit/:id', async (req, res) => {
	const { id } = req.params;

	res.render('index', {
		...options,
		notes: await getNotes(),
		id,
		alerted: true,
		edited: (hasEdited ? true : false),
	});
	hasEdited = false;
});

app.get('/remove/:id', async (req, res) => {
	res.render('index', {
		...options,
		notes: await getNotes(),
		alerted: true,
		removed: (hasRemoved ? true : false),
	});
	hasRemoved = false;
});

app.get('*', (req, res) => {
	res.redirect('/');
});
