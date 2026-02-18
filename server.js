const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const DB_PATH = './db.json';

app.use(cors());
app.use(express.json());

const inicializarDB = () => {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify([]));
    }
};

app.get('/objetivos', (req, res) => {
    inicializarDB();
    const datos = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(datos);
});

app.post('/objetivos', (req, res) => {
    inicializarDB();
    const datos = JSON.parse(fs.readFileSync(DB_PATH));
    const nuevo = { id: Date.now(), texto: req.body.texto };
    datos.push(nuevo);
    fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
    res.json(nuevo);
});

app.put('/objetivos/:id', (req, res) => {
    let datos = JSON.parse(fs.readFileSync(DB_PATH));
    const index = datos.findIndex(obj => obj.id === parseInt(req.params.id));
    if (index !== -1) {
        datos[index].texto = req.body.texto;
        fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
        res.json({ mensaje: "Editado" });
    }
});

app.delete('/objetivos/:id', (req, res) => {
    let datos = JSON.parse(fs.readFileSync(DB_PATH));
    datos = datos.filter(obj => obj.id !== parseInt(req.params.id));
    fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
    res.json({ mensaje: "Borrado" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));