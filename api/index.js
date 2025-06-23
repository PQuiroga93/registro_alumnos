const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 5001;

// API Key ficticia
//comentarios// 
const API_KEY = '12345ABCDEF';

// Middleware
app.use(cors());
app.use(express.json());

// Archivo donde se almacenan los estudiantes
const STUDENTS_FILE = './students.json';

// Función para leer estudiantes desde archivo
function loadStudents() {
    try {
        const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error loading students, using empty list.", error);
        return [];
    }
}

// Función para guardar estudiantes en archivo
function saveStudents(students) {
    try {
        fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2));
    } catch (error) {
        console.error("Error saving students:", error);
    }
}

// Inicializar estudiantes
let students = loadStudents();

// Middleware para validar API Key
app.use((req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
        return res.status(401).json({ error: 'Unauthorized. Invalid API Key.' });
    }
    next();
});

// ============================
// Endpoints
// ============================

// Registrar nuevo estudiante
app.post('/api/students', (req, res) => {
    const { name, career } = req.body;

    if (!name || !career) {
        return res.status(400).json({ error: "Missing required fields: name and career." });
    }

    const newId = students.length ? students[students.length - 1].id + 1 : 1;

    const newStudent = {
        id: newId,
        name,
        career
    };

    students.push(newStudent);
    saveStudents(students); // Guardar cambios

    return res.status(201).json({ message: "Student registered successfully.", student: newStudent });
});

// Consultar estudiante por ID
app.get('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ error: "Student not found." });
    }

    return res.status(200).json(student);
});

// Consultar estudiantes por carrera
app.get('/api/students', (req, res) => {
    const career = req.query.career;

    if (!career) {
        return res.status(400).json({ error: "Career filter is required." });
    }

    const filtered = students.filter(s => s.career.toLowerCase() === career.toLowerCase());
    return res.status(200).json(filtered);
});

// Eliminar estudiante por ID
app.delete('/api/students/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Student not found for deletion." });
    }

    students.splice(index, 1);
    saveStudents(students); // Guardar cambios

    return res.status(200).json({ message: "Student deleted successfully." });
});

// ============================
// Start server
// ============================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
