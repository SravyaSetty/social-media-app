// async function login() {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;
//   const res = await fetch('http://localhost:5000/api/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   if (res.ok) {
//     localStorage.setItem('username', username);
//     window.location.href = 'dashboard.html';
//   } else {
//     alert('Login failed');
//   }
// }

// async function register() {
//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;
//   const res = await fetch('http://localhost:5000/api/register', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, password })
//   });
//   if (res.ok) {
//     alert('Registered! Now login.');
//   } else {
//     alert('Registration failed');
//   }
// }

const api = 'http://localhost:5000/api';

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${api}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('username', username);
    location.href = 'dashboard.html';
  } else {
    alert(data.error);
  }
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch(`${api}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registered! Now login.');
  } else {
    alert(data.error);
  }
}
