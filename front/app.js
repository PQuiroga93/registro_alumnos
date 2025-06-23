// ============================
// CONFIGURACIÓN GENERAL
// ============================

// Dirección base de la API (localhost y puerto del backend)
const API_BASE = 'http://localhost:5001/api';

// Encabezado requerido para autenticación
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer 12345ABCDEF'
};

// ============================
// FUNCIÓN: REGISTRAR ESTUDIANTE
// ============================
// Registra un nuevo estudiante con los datos ingresados en el formulario.
// Verifica que todos los campos estén completos, luego envía una solicitud POST a la API.
// Si se registra exitosamente, muestra un mensaje de éxito y limpia el formulario.
function registerStudent() {
  const name = document.getElementById('registerName').value.trim();
  const dni = document.getElementById('registerDni').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  const career = document.getElementById('registerCareer').value;

  if (!name || !dni || !email || !password || !career) {
    Swal.fire('Campos incompletos', 'Por favor completá todos los campos.', 'warning');
    return;
  }

  const student = { name, dni, email, password, career };

  fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers,
    body: JSON.stringify(student)
  })
    .then(res => res.json())
    .then(data => {
      Swal.fire('Registro exitoso', 'El estudiante fue registrado correctamente.', 'success');
      document.querySelector('form').reset();
    })
    .catch(error => {
      console.error('Error al registrar estudiante:', error);
      Swal.fire('Error', 'No se pudo registrar al estudiante.', 'error');
    });
}

// ============================
// FUNCIÓN: LOGIN
// ============================
// Escucha el envío del formulario de login (Ingreso.html).
// Valida que los campos no estén vacíos y envía una solicitud POST al endpoint /login.
// Si el login es exitoso, guarda la info del usuario en localStorage y redirige al panel (adm.html).
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!email || !password) {
        Swal.fire('Campos vacíos', 'Por favor completá tu correo y contraseña.', 'warning');
        return;
      }

      fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            Swal.fire('Error', data.error, 'error');
          } else {
            Swal.fire('Bienvenido', 'Ingreso exitoso', 'success');
            // Guardar info del usuario 
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            // Redirigir al panel de administración
            window.location.href = 'adm.html';
          }
        })
        .catch(error => {
          console.error('Error en login:', error);
          Swal.fire('Error', 'No se pudo realizar el ingreso.', 'error');
        });
    });
  }
});
// ============================
// MOSTRAR NOMBRE DEL USUARIO
// ============================
// Obtiene los datos del usuario desde localStorage.
// Si hay datos, muestra un mensaje de bienvenida con el nombre del usuario en el elemento con id "welcomeMessage".

const userData = localStorage.getItem('loggedUser');
if (userData) {
  const user = JSON.parse(userData);
  const welcomeDiv = document.getElementById('welcomeMessage');
  if (welcomeDiv && user.name) {
    welcomeDiv.textContent = `Bienvenida, ${user.name}`;
  }
}

// ============================
// FUNCIÓN: LOGOUT
// ============================
// Escucha el clic del botón de logout (id="logoutBtn").
// Muestra un mensaje de confirmación y, si se acepta, borra los datos del usuario del localStorage
// y redirige a la página de login (Ingreso.html).

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Se cerrará tu sesión actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('loggedUser'); // Borra el usuario
          window.location.href = 'Ingreso.html'; // Redirige al login
        }
      });
    });
  }
});
// ============================
// PROTEGER PÁGINAS PRIVADAS
// ============================
// Verifica si el usuario está autenticado al entrar a páginas protegidas como "adm.html".
// Si no hay un usuario en localStorage, muestra una alerta y redirige a la página de login.

document.addEventListener('DOMContentLoaded', () => {
  const protectedPages = ['adm.html']; // Podés agregar más
  const currentPage = window.location.pathname.split('/').pop();

  if (protectedPages.includes(currentPage)) {
    const user = localStorage.getItem('loggedUser');
    if (!user) {
      Swal.fire('Acceso no autorizado', 'Debés iniciar sesión primero.', 'warning')
        .then(() => {
          window.location.href = 'Ingreso.html';
        });
    }
  }
});
// ============================
// ELIMINAR ESTUDIANTE POR ID
// ============================
// Elimina un estudiante utilizando su ID (obtenido de un input con id="deleteStudentId").
// Confirma la acción con el usuario, y si se acepta, envía una solicitud DELETE a la API.
// Si la eliminación es exitosa, muestra un mensaje de confirmación.

function deleteStudentById() {
  const id = document.getElementById('deleteStudentId').value;
  if (!id) {
    Swal.fire('Error', 'Ingresá un ID válido', 'warning');
    return;
  }

  Swal.fire({
    title: `¿Eliminar estudiante con ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`${API_BASE}/students/${id}`, {
        method: 'DELETE',
        headers
      })
        .then(res => res.json())
        .then(data => {
          Swal.fire('Eliminado', data.message, 'success');
          // Podés recargar la tabla de estudiantes si la tenés
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo eliminar el estudiante.', 'error');
        });
    }
  });
}
// ============================
// ELIMINAR CARRERA POR ID
// ============================
// Elimina una carrera académica utilizando su ID (input con id="deleteCareerId").
// Solicita confirmación al usuario antes de enviar una solicitud DELETE a la API.
// Muestra un mensaje con el resultado de la operación.

function deleteCareerById() {
  const id = document.getElementById('deleteCareerId').value;
  if (!id) {
    Swal.fire('Error', 'Ingresá un ID válido', 'warning');
    return;
  }

  Swal.fire({
    title: `¿Eliminar carrera con ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`${API_BASE}/careers/${id}`, {
        method: 'DELETE',
        headers
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            Swal.fire('Error', data.error, 'error');
          } else {
            Swal.fire('Eliminado', data.message, 'success');
          }
          // Podés recargar la tabla de carreras si la tenés
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo eliminar la carrera.', 'error');
        });
    }
  });
}
function deleteCategoryById() {
  const id = document.getElementById('deleteCategoryId').value;
  if (!id) {
    Swal.fire('Error', 'Ingresá un ID válido.', 'warning');
    return;
  }

  Swal.fire({
    title: `¿Eliminar categoría con ID ${id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
        headers
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            Swal.fire('Error', data.error, 'error');
          } else {
            Swal.fire('Eliminado', data.message, 'success');
            loadCategories(); // recargar lista
          }
        })
        .catch(err => {
          console.error(err);
          Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
        });
    }
  });
}
