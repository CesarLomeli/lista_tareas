const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Configuración
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Habilitar CORS para todas las solicitudes
app.use(bodyParser.json()); // Parsear JSON
app.use(express.static('public'));

// Conexión a la base de datos
const db = new sqlite3.Database('./server/database.db', (err) => {
    if (err) console.error(err.message);
    else console.log('Conectado a la base de datos SQLite');
});

// Crear tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    )
`);

// Rutas API
// Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error al obtener las tareas' });
        } else {
            res.json(rows);
        }
    });
});

// Agregar una tarea
app.post('/api/tasks', (req, res) => {
    const { title, description } = req.body;
    db.run(
        'INSERT INTO tasks (title, description) VALUES (?, ?)',
        [title, description],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Error al agregar la tarea' });
            } else {
                res.json({ id: this.lastID, title, description });
            }
        }
    );
});

// Eliminar tarea
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Error al eliminar la tarea' });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Tarea no encontrada' });
        } else {
            res.json({ message: 'Tarea eliminada correctamente' });
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
