// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
	db.find().then((users) => res.status(200).json(users)).catch((err) => {
		console.log(err);
		res.status(500).json({ error: 'the user information could not be retrieved' });
	});
});

server.post('/api/users', (req, res) => {
	console.log(req.body);
	const user = req.body;
	if (!name && !bio) {
		res.status(400).json({ error: 'Please provide name and bio for the user' });
	}
	db
		.insert(user)
		.then(({ id }) =>
			db
				.findById(id)
				.then((user) => {
					res.status(201).json(user);
				})
				.catch((err) => {
					res.status(500).json({ error: 'There was an error while retrieving the user from the database' });
				})
		)
		.catch((err) => {
			res.status(500).json({ error: 'There was an error while saving the user to the database' });
		});
});

server.get('/api/users/:id', (req, res) => {
	// this comes from the id in the request params which will give you the id of the user being requested.
	const { id } = req.params;
	db
		.findById(id)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'the user with the specified id odes not exist' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'the user information could not be retrieved' });
		});
});

server.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	db
		.remove(id)
		.then((deleted) => {
			if (deleted) {
				res.status(204).end();
			} else {
				res.status(404).json({ error: 'The user with the specified ID does not exist' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'The user could not be removed' });
		});
});

server.put('/api/user/:id', (req, res) => {
	const { id } = req.params;
	const { name, bio } = req.body;
	if (!name && !bio) {
		return res.status(400).json({ error: 'Please provide name and bio for the user' });
	}
	db
		.update(id, { name, bio })
		.then((updated) => {
			if (updated) {
				db.findById(id).then((user) => res.status(200).json(user)).catch((err) => {
					console.log(err);
					res.status(500).json({ error: 'error retrieving user' });
				});
			} else {
				res.status(404).json({ error: 'user with the specified id does not exist' });
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({ error: 'the user information could not be modified' });
		});
});

server.listen(5000, () => {
	console.log('server listening on port 6000');
});
