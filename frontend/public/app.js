const API_BASE = 'http://localhost:3000/api';

let token = null;
let userRole = null;

function showLogin() {
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('register-section').style.display = 'none';
  document.getElementById('login-error').innerText = '';
}

function showRegister() {
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('register-section').style.display = 'block';
  document.getElementById('register-error').innerText = '';
}

async function login() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('login-error');

  email.value = email.toLowerCase();

  if (!email || !password) {
    errorEl.innerText = 'Correo y contraseña requeridos';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      token = data.token;
      userRole = data.user.role;

      document.getElementById('login-section').style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
      document.getElementById('welcome').innerText =
        `Bienvenido, ${data.user.name} (${data.user.role})`;

      if (userRole === 'admin' || userRole === 'abogado') {
        document.getElementById('case-form-section').style.display = 'block';
        loadClients();
        loadLawyers();
      }

      loadCases();
      fetchNotifications();
    } else {
      errorEl.innerText = data.error || 'Credenciales inválidas';
    }
  } catch (err) {
    errorEl.innerText = 'Error de conexión con el servidor';
    console.error(err);
  }
}

async function register() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const role = document.getElementById('reg-role').value;
  const errorEl = document.getElementById('register-error');

  console.log('Registro enviado:', { name, email, password, role });

  if (!name || !email || !password || role === '') {
    errorEl.innerText = 'Todos los campos son obligatorios';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (res.ok || res.status === 201) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      showLogin();
      document.getElementById('register-section').reset();
      errorEl.innerText = '';
    } else {
      errorEl.innerText = data.error || 'Error en el registro';
    }
  } catch (err) {
    errorEl.innerText = 'Error de red al registrar';
    console.error(err);
  }
}

function logout() {
  token = null;
  userRole = null;
  localStorage.removeItem('token');
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
  showLogin();
}

function loadCases() {
  const url = (userRole === 'cliente')
    ? `${API_BASE}/client-portal/my-cases`
    : `${API_BASE}/cases`;

  fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('cases-container');
      container.innerHTML = '';

      if (Array.isArray(data)) {
        data.forEach(c => {
          const div = document.createElement('div');
          div.className = 'case';
          div.innerHTML = `
            <strong>${c.referenceCode}</strong><br>
            Tipo: ${c.caseType}<br>
            Fecha inicio: ${c.startDate?.substring(0, 10)}<br>
            Detalles: ${c.details}<br>
            <br>
            <strong>Tareas:</strong><ul>
              ${(c.tasks || []).map(t => `<li>${t.description} (${t.status})</li>`).join('')}
            </ul>
            <strong>Plazos:</strong><ul>
              ${(c.deadlines || []).map(d => `<li>${d.title} - ${d.dueDate?.substring(0, 10)}</li>`).join('')}
            </ul>
          `;
          container.appendChild(div);
        });
      }
    })
    .catch(err => console.error('Error al cargar casos:', err));
}

function createCase(event) {
  event.preventDefault();

  const referenceCode = document.getElementById('referenceCode').value.trim();
  const caseType = document.getElementById('caseType').value.trim();
  const startDate = document.getElementById('startDate').value;
  const details = document.getElementById('details').value.trim();
  const clientId = document.getElementById('clientId').value;
  const lawyerId = document.getElementById('lawyerId').value;
  const errorEl = document.getElementById('case-error');

  if (!referenceCode || !caseType || !startDate || !details || !clientId || !lawyerId) {
    errorEl.innerText = 'Todos los campos son obligatorios';
    return;
  }

  fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ referenceCode, caseType, startDate, details, clientId, lawyerId})
  })
    .then(res => res.json())
    .then(data => {
      if (data.id) {
        alert('Caso creado exitosamente');
        document.getElementById('case-form').reset();
        loadCases();
      } else {
        errorEl.innerText = data.error || 'Error al crear el caso';
      }
    })
    .catch(err => {
      errorEl.innerText = 'Error de red al crear el caso';
      console.error(err);
    });
}

function loadClients() {
  fetch(`${API_BASE}/clients`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('clientId');
      select.innerHTML = '';
      data.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = `${client.fullname} (ID: ${client.id})`;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar clientes:', err);
      const select = document.getElementById('clientId');
      select.innerHTML = '<option value=\"\">Error al cargar clientes</option>';
    });
}

async function fetchNotifications() {
  try {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const notifications = await res.json();

    const container = document.getElementById('notifications-container');
    container.innerHTML = '';

    if (notifications.length === 0) {
      container.innerHTML = '<p>No tienes notificaciones.</p>';
      return;
    }

    notifications.forEach(n => {
      const div = document.createElement('div');
      div.classList.add('case');
      div.innerHTML = `
        <strong>${n.title}</strong><br/>
        <span>${n.message}</span><br/>
        <small>${new Date(n.createdAt).toLocaleString()}</small>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Error al obtener notificaciones', err);
  }
}

function loadLawyers() {
  fetch(`${API_BASE}/lawyers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('lawyerId');
      select.innerHTML = ''; // limpiar opciones anteriores
      data.forEach(lawyer => {
        const option = document.createElement('option');
        option.value = lawyer.id;
        option.textContent = `${lawyer.name} (ID: ${lawyer.id})`;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar abogados:', err);
      const select = document.getElementById('lawyerId');
      select.innerHTML = '<option value="">Error al cargar abogados</option>';
    });
}
