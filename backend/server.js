// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Middleware

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema y modelo de Participante
const participanteSchema = new mongoose.Schema({
    telefono: { type: String, required: true, unique: true },
    nombre: { type: String },
    correo: { type: String }
});

const Participante = mongoose.model('Participante', participanteSchema);

const { check, validationResult } = require('express-validator');

// Ruta para el registro de participante
// Ruta para el registro de participante
app.post('/api/registro', async (req, res) => {
    console.log('Datos recibidos en /api/registro:', req.body); // Verifica que los datos lleguen al servidor

    const { telefono } = req.body;
    try {
        let participante = await Participante.findOne({ telefono });
        if (participante) {
            console.log('El número ya está registrado:', telefono);
            return res.status(400).json({ message: 'El número ya está registrado.' });
        }

        participante = new Participante({ telefono });
        await participante.save();
        console.log('Número registrado exitosamente:', telefono);
        return res.status(201).json({ message: 'Número de teléfono registrado exitosamente.' });
    } catch (err) {
        console.error('Error al registrar el número:', err);
        // Asegúrate de devolver siempre una respuesta en formato JSON en caso de error
        return res.status(500).json({ message: 'Error al registrar el número de teléfono.', error: err.message });
    }
});

// Ruta para completar el registro
app.post('/api/completar-registro', [
    check('nombre').isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo debe contener letras.'),
    check('correo').isEmail().withMessage('Ingresa un correo electrónico válido.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { telefono, nombre, correo } = req.body;

    try {
        let participante = await Participante.findOne({ telefono });
        if (!participante) {
            return res.status(404).json({ message: 'Participante no encontrado.' });
        }

        participante.nombre = nombre;
        participante.correo = correo;
        await participante.save();

        console.log('Registro completado exitosamente:', { telefono, nombre, correo });
        return res.status(200).json({ message: 'Registro completado exitosamente.', participante });
    } catch (err) {
        console.error('Error al completar el registro:', err);
        return res.status(500).json({ message: 'Error al completar el registro.' });
    }
});

// Ruta para obtener ganadores
app.get('/api/ganadores', async (req, res) => {
    try {
        const ganadores = await Participante.find({ nombre: { $exists: true }, correo: { $exists: true } });
        res.status(200).json(ganadores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

// Servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta para servir el archivo 'index.html' en la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor en el puerto asignado por Railway
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});



