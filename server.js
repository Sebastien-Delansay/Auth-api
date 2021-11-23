// On importe la bibliothèque dotenv afin de charger les variables d'environnement
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

const appPort = process.env.PORT || 3500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
	origin: '*',
	methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

async function start() {
	try {
		// On se connecte à la base de données
		await connectDB();
		app.listen(appPort, () => console.log(`Server is listening on port ${appPort}...`));
	} catch (error) {
		// Si une erreur est survenue, on l'affiche dans la console
		console.log(error);
	}
}

// On démarre l'application NodeJs avec le port 3500
start();

// Routes
// On définit les routes de l'application
app.use('/api/', userRoutes);
