// On importe la bibliothèque express
const express = require('express');
const router = express.Router();
// On importe le userController permettant de communiquer avec la base de données
const userController = require('../controllers/userController');

// On définit le chemin de la route
router.get('/users/', userController.getAllUsers);

router.post('/users/register/', userController.register);

router.post('/users/login/', userController.login);

router.get('/users/me/', userController.getUserProfile);

router.put('/users/me/', userController.updateUserProfile);

// On exporte le router
module.exports = router;

