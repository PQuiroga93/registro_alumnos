// =======================
// IMPORTACIÓN DE MÓDULOS
// =======================
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

// =======================
// CONFIGURACIÓN GENERAL
// =======================
const PORT = 5001;
const API_KEY = '12345ABCDEF';
app.use(cors());
app.use(express.json());

// =======================
// CARGA INICIAL DE ARCHIVOS JSON
// =======================
const students = JSON.parse(fs.readFileSync('./students.json', 'utf-8'));
const careers = JSON.parse(fs.readFileSync('./careers.json', 'utf-8'));
const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf-8'));

// =======================
// FUNCIONES PARA GUARDAR EN ARCHIVOS
// =======================
function saveStudents(data) {
  fs.writeFileSync('./students.json', JSON.stringify(data, null, 2));
}
function saveCareers(data) {
  fs.writeFileSync('./careers.json', JSON.stringify(data, null, 2));
}
function saveCategories(data) {
  fs.writeFileSync('./categories.json', JSON.stringify(data, null, 2));
}

// =======================
// MIDDLEWARE: AUTORIZACIÓN
// =======================
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
});

// =======================
// RUTAS DE ESTUDIANTES
// =======================

// Obtener todos los estudiantes
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Obtener estudiante por ID
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id == req.params.id);
  if (!student) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(student);
});

// Crear nuevo estudiante
app.post('/api/students', (req, res) => {
  const { name, career, dni, email, password } = req.body;
  if (!name || !career || !dni || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const newId = students.length ? students[students.length - 1].id + 1 : 1;
  const newStudent = { id: newId, name, career, dni, email, password };
  students.push(newStudent);
  saveStudents(students);
  res.status(201).json({ message: 'Estudiante registrado', student: newStudent });
});

// Actualizar estudiante
app.put('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, career, dni, email, password } = req.body;
  const index = students.findIndex(s => s.id === id);
  if (index === -1) return res.status(404).json({ error: 'Estudiante no encontrado' });
  students[index] = { id, name, career, dni, email, password };
  saveStudents(students);
  res.json({ message: 'Estudiante actualizado', student: students[index] });
});

// Eliminar estudiante
app.delete('/api/students/:id', (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Estudiante no encontrado' });
  students.splice(index, 1);
  saveStudents(students);
  res.json({ message: 'Estudiante eliminado' });
});

// =======================
// RUTAS DE CARRERAS
// =======================

// Obtener todas las carreras
app.get('/api/careers', (req, res) => {
  res.json(careers);
});

// Obtener carrera por ID
app.get('/api/careers/:id', (req, res) => {
  const career = careers.find(c => c.id == req.params.id);
  if (!career) return res.status(404).json({ error: 'Carrera no encontrada' });
  res.json(career);
});

// Crear nueva carrera
app.post('/api/careers', (req, res) => {
  const { name, category, description } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const newId = careers.length ? careers[careers.length - 1].id + 1 : 1;
  const newCareer = { id: newId, name, category, description };
  careers.push(newCareer);
  saveCareers(careers);
  res.status(201).json({ message: 'Carrera creada', career: newCareer });
});

// Actualizar carrera
app.put('/api/careers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, category, description } = req.body;
  const index = careers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Carrera no encontrada' });
  careers[index] = { id, name, category, description };
  saveCareers(careers);
  res.json({ message: 'Carrera actualizada', career: careers[index] });
});

// Eliminar carrera
app.delete('/api/careers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const related = students.some(s => s.career === careers.find(c => c.id === id)?.name);
  if (related) return res.status(409).json({ error: 'Hay alumnos con esta carrera' });
  const index = careers.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Carrera no encontrada' });
  careers.splice(index, 1);
  saveCareers(careers);
  res.json({ message: 'Carrera eliminada' });
});

// =======================
// RUTAS DE CATEGORÍAS
// =======================

// Obtener todas las categorías
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// Obtener categoría por ID
app.get('/api/categories/:id', (req, res) => {
  const category = categories.find(c => c.id == req.params.id);
  if (!category) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(category);
});

// Crear nueva categoría
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'El nombre es obligatorio' });
  const newId = categories.length ? categories[categories.length - 1].id + 1 : 1;
  const newCategory = { id: newId, name, description };
  categories.push(newCategory);
  saveCategories(categories);
  res.status(201).json({ message: 'Categoría creada', category: newCategory });
});

// Actualizar categoría
app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Categoría no encontrada' });
  categories[index] = { id, name, description };
  saveCategories(categories);
  res.json({ message: 'Categoría actualizada', category: categories[index] });
});

// Eliminar categoría
app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const related = careers.some(c => c.category === categories.find(cat => cat.id === id)?.name);
  if (related) return res.status(409).json({ error: 'Hay carreras con esta categoría' });
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Categoría no encontrada' });
  categories.splice(index, 1);
  saveCategories(categories);
  res.json({ message: 'Categoría eliminada' });
});

// =======================
// LOGIN (VALIDACIÓN BÁSICA)
// =======================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = students.find(s => s.email === email && s.password === password);
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  res.json({ message: 'Login exitoso', user });
});

// =======================
// INICIAR EL SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
