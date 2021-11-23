// On importe le userModel afin de pouvoir communiqué avec le document User dans la base de données
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('../config/jwt.config');
const PASSWORD_REGEX = /^(?=.*\d).{4,12}$/;

// Export du module userController et ses fonctions.
module.exports = {

	// Permet de récupérer tous les utilisateurs
	getAllUsers: async (req, res) => {
		
		// Déclaration de la variable users qui contiendra tous les utilisateurs
		const users = await userModel.find();
		// On renvoie la réponse au client
		res.status(200).json({ users });
	},

	//Creer un nouvel utilisateur
	register: function(req, res){

		let name = req.body.name;
		let email = req.body.email;
		let bio = req.body.bio;
		let password = req.body.password;

		
	
		if (name === null || email === null || password === null) {
			return res.status(400).json({'error':'missing parameters'});
		}

		if (name.length >= 25 || name.length <= 3){
			return res.status(400).json({'error': "wrong username length (3 - 25)"})
		}

		if (!PASSWORD_REGEX.test(password)){
			return res.status(400).json({ 'error': 'password invalid (length 4 - 12 and include 1 number'})
		}

		userModel.findOne({email:email})
		.then(function(userFound){
			if (!userFound){
				bcrypt.hash(password, 5, function(err, bcryptedPassword){

					
					
					
						const newUser = userModel.create({
							name: name,
							email: email,
							bio: bio,
							password: bcryptedPassword});

							
						return res.status(201).json({
							'userId': newUser.id
						})
					
					

				});
			} else {
				return res.status(409).json({ 'error': 'user already exist'});
			}

		})
		.catch(function(err){

			return res.status(500).json({ 'error': 'unable to verify user'});

		});



	},

	//Pour se connecter
	login: function(req, res){

		let email = req.body.email;
		let password = req.body.password;

		if (email == null || password == null){
			return res.status(400).json({ 'error': 'missing parameters'});
		}

		userModel.findOne({email:email})
		.then(function(userFound){
			if (userFound){

				bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
					if(resBycrypt){
						return res.status(200).json({
							'userId': userFound.id,
							'token': jwt.generateTokenForUser(userFound)
						});
					}else{
						return res.status(403).json({ 'error': 'invalid password'});
					}
				})

			}else{
				return res.status(404).json({ 'error': 'user not exist in DB'});
			}

		})
		.catch(function(err){
			return res.status(500).json({ 'error': 'unable to verify user'});
		})


	},

	// afficher un profil
	getUserProfile: function(req, res){

		const headerAuth = req.headers['authorization'];
		const userId = jwt.getUserId(headerAuth);

		if (userId < 0){
			return res.status(400).json({ 'error': 'wrong token'});
		}

		userModel.findOne({ _id: userId }, '-password'
		).then(function(user){
			if (user){
				res.status(201).json(user);
			}else{
				res.status(404).json({'error': 'user not found'});
			}
		}).catch(function(err){
			res.status(500).json({ 'error': 'connot fetch user'});
		});

	},

	// modifier un profil
	updateUserProfile: function(req, res){

		const headerAuth = req.headers['authorization'];
		const userId = jwt.getUserId(headerAuth);

		let bio = req.body.bio;

		if (userId < 0){
			return res.status(400).json({ 'error': 'wrong token'});
		}

		userModel.findOne({ _id: userId })
		.then(function(userFound){
			if(userFound){
				userFound.update({
					bio: (bio ? bio : userFound.bio)
				}).then(function(userFound){
					return res.status(201).json(userFound);
				}).catch(function(err){
					res.status(500).json({ 'error': 'cannot update user'});
				});
			}else{
				res.status(404).json({ 'error': 'user not found'});
			}
		})
	}


};
