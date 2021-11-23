// On importe la bibliothèque (package) mongoose
const mongoose = require('mongoose');

// Fonction connectDB permettant de connecter notre application à la base de données
const connectDB = () => {
	return mongoose.connect(process.env.MONGO_URI).then(()=>console.log("connected to mongo"));
};

// Export de la fonction connectDB
module.exports = connectDB;
