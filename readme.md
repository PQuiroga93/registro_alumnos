# Student API Documentation

---

## 📍 Introducción

Esta es una API REST educativa para gestionar una base de datos simple de estudiantes. Permite:

- Registrar nuevos estudiantes.
- Consultar estudiantes por ID.
- Consultar estudiantes por carrera.
- Eliminar estudiantes.

Los datos de los estudiantes se almacenan mediante un archivo JSON local (`students.json`) para simular una base de datos.

---

## 🔍 Base URL

```bash
http://localhost:5001/api/students
```

El servidor debe estar ejecutándose en el puerto
 `5001`.

---

## 🔒 Authentication

All requests must include an **API Key** in the Authorization header:

```text
Authorization: Bearer 12345ABCDEF
```

If the key is missing or incorrect, the server will respond with `401 Unauthorized`.

---
Todas las solicitudes deben incluir una **Clave API** en el encabezado de autorización:

```texto
Autorización: Portador 12345ABCDEF
```

Si la clave falta o es incorrecta, el servidor responderá con `401 No autorizado`.

---
## 🔍 Endpoints

### 1. Register New Student

- **URL**: `/api/students`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer 12345ABCDEF`
- **Body**:

```json
{
  "name": "John Doe",
  "career": "Engineering"
}
```

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:

```json
{
  "message": "Student registered successfully.",
  "student": {
    "id": 51,
    "name": "John Doe",
    "career": "Engineering"
  }
}
```

### 2. Get Student by ID

- **URL**: `/api/students/:id`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "career": "Engineering"
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found."
}
```

### 3. Get Students by Career

- **URL**: `/api/students?career=CareerName`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Example**:

```bash
GET /api/students?career=Engineering
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content** (array of matching students):

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "career": "Engineering"
  },
  {
    "id": 6,
    "name": "Fiona Miller",
    "career": "Engineering"
  }
]
```

- **Error Response**:
  - **Code**: `400 Bad Request` if `career` is missing.

```json
{
  "error": "Career filter is required."
}
```

### 4. Delete Student by ID

- **URL**: `/api/students/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`

```json
{
  "message": "Student deleted successfully."
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found for deletion."
}
```

---

## 💡 Notes

- Todas las respuestas están en formato JSON.
- Si modifica los estudiantes (añadirlos o eliminarlos), los cambios se guardan automáticamente en `students.json`.
- Al reiniciar el servidor, se conserva la lista actualizada gracias a la persistencia JSON.

---

## 💼 Example Authorization Header

```text
Authorization: Bearer 12345ABCDEF
```

Esto debe incluirse en cada solicitud.

---

# 📖 Educational Objectives

- Practicar el envío de solicitudes a una API REST.
- Aprender sobre los métodos HTTP: `GET`, `POST`, `DELETE`.
- Comprender el formato de datos JSON.
- Experimentar la persistencia básica del lado del servidor.
- Gestionar la autenticación con claves API.
---

**Happy coding! 🚀**

