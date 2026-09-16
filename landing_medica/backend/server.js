const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Directorio para guardar los archivos subidos
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) { 
    fs.mkdirSync(uploadDir); 
}

// Servir la carpeta uploads de manera pública
app.use('/archivos', express.static(uploadDir));

// Configuración de Multer para guardar con el DNI como nombre de archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const dni = req.body.dni;
        const extension = path.extname(file.originalname);
        cb(null, `${dni}${extension}`);
    }
});
const upload = multer({ storage: storage });

// Ruta de Login del Médico
app.post('/api/login', (req, res) => {
    const { usuario, password } = req.body;
    if (usuario === 'admin' && password === '123456') {
        res.json({ exito: true, mensaje: 'Acceso autorizado' });
    } else {
        res.status(401).json({ exito: false, mensaje: 'Usuario o contraseña incorrectos' });
    }
});

// Ruta para subir el examen médico
app.post('/api/upload', upload.single('examen'), (req, res) => {
    if (!req.file || !req.body.dni || req.body.dni.length !== 7) {
        return res.status(400).json({ error: 'El DNI debe tener exactamente 7 dígitos o falta el archivo.' });
    }
    console.log(`✅ Examen subido para el DNI: ${req.body.dni}`);
    res.json({ mensaje: 'Examen guardado exitosamente.', archivo: req.file.filename });
});

// Ruta para buscar el examen por DNI
app.get('/api/buscar/:dni', (req, res) => {
    const dni = req.params.dni;
    if (dni.length !== 7) {
        return res.json({ encontrado: false, mensaje: 'El DNI debe tener exactamente 7 dígitos.' });
    }
    
    const files = fs.readdirSync(uploadDir);
    const match = files.find(f => f.startsWith(dni + '.'));
    
    if (match) {
        // Detectar protocolo y host de forma segura considerando los proxies de Render
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        const host = req.get('host');
        res.json({ encontrado: true, url: `${protocol}://${host}/archivos/${match}` });
    } else {
        res.json({ encontrado: false, mensaje: 'No se encontraron resultados para este DNI.' });
    }
});

// Importante: Escuchar en '0.0.0.0' para que Render no cierre la aplicación
app.listen(port, '0.0.0.0', () => {
    console.log(`🏥 Backend médico corriendo en el puerto ${port}`);
});
