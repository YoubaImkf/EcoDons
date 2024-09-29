const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jsonServer = require('json-server');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s/g, '_');  // Remplace les espaces par des underscores
      cb(null, Date.now() + '-' + safeName);
    },
  });
  

const upload = multer({ storage });

const app = express();

// Utiliser CORS pour éviter les problèmes de partage de ressources
app.use(cors());

// Route pour servir les fichiers téléchargés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route pour télécharger les fichiers
app.post('/upload', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier téléchargé' });
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });  // Renvoie le chemin de l'image
});

// Utilisation de JSON Server
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
app.use('/api', middlewares, router);

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
