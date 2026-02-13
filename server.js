const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const DB_PATH = './db.json';

app.use(cors());
app.use(express.json());

// Leer Objetivos
app.get('/objetivos', (req, res) => {
    const datos = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(datos);
});

// Crear Objetivo
app.post('/objetivos', (req, res) => {
    const datos = JSON.parse(fs.readFileSync(DB_PATH));
    const nuevo = { id: Date.now(), texto: req.body.texto };
    datos.push(nuevo);
    fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
    res.json(nuevo);
});

// Editar Objetivo
app.put('/objetivos/:id', (req, res) => {
    let datos = JSON.parse(fs.readFileSync(DB_PATH));
    const id = parseInt(req.params.id);
    const index = datos.findIndex(obj => obj.id === id);
    if (index !== -1) {
        datos[index].texto = req.body.texto;
        fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
        res.json({ mensaje: "Editado" });
    }
});

// Borrar Objetivo
app.delete('/objetivos/:id', (req, res) => {
    let datos = JSON.parse(fs.readFileSync(DB_PATH));
    datos = datos.filter(obj => obj.id !== parseInt(req.params.id));
    fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));
    res.json({ mensaje: "Borrado" });
});

app.listen(3000, () => console.log("✅ Servidor Backend en puerto 3000"));