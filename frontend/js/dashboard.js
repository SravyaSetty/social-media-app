
// const api = 'http://localhost:5000/api';
// document.getElementById('user').innerText = localStorage.getItem('username');
// let selectedGroupId = null;
// let selectedTaskId = null;

// function logout() {
//   localStorage.removeItem('username');
//   location.href = 'index.html';
// }

// async function createGroup() {
//   const name = prompt("Group name?");
//   if (!name) return;
//   const res = await fetch(`${api}/groups`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, createdBy: localStorage.getItem('username') })
//   });
//   await loadGroups();
// }

// async function loadGroups() {
//   const res = await fetch(`${api}/groups`);
//   const groups = await res.json();
//   const list = document.getElementById('groupList');
//   list.innerHTML = '';
//   groups.forEach(g => {
//     const btn = document.createElement('button');
//     btn.textContent = g.name;
//     btn.onclick = () => selectGroup(g.id, g.name);
//     list.appendChild(btn);
//   });
// }

// async function selectGroup(groupId, groupName) {
//   selectedGroupId = groupId;
//   document.getElementById('taskSection').style.display = 'block';
//   document.getElementById('groupTitle').innerText = groupName;
//   loadTasks();
// }

// async function createTask() {
//   const title = prompt("Task title?");
//   if (!title) return;
//   const assignedTo = prompt("Assign to (username)?");
//   const res = await fetch(`${api}/tasks`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ title, groupId: selectedGroupId, assignedTo })
//   });
//   await loadTasks();
// }

// async function loadTasks() {
//   const res = await fetch(`${api}/tasks/${selectedGroupId}`);
//   const tasks = await res.json();
//   const list = document.getElementById('taskList');
//   list.innerHTML = '';
//   tasks.forEach(t => {
//     const li = document.createElement('li');
//     li.textContent = `${t.title} (assigned to ${t.assignedTo})`;
//     li.onclick = () => selectTask(t.id, t.title);
//     list.appendChild(li);
//   });
// }

// async function selectTask(taskId, taskTitle) {
//   selectedTaskId = taskId;
//   document.getElementById('taskTitle').innerText = taskTitle;
//   document.getElementById('commentSection').style.display = 'block';
//   loadComments();
// }

// async function loadComments() {
//   const res = await fetch(`${api}/comments/${selectedTaskId}`);
//   const comments = await res.json();
//   const list = document.getElementById('commentList');
//   list.innerHTML = '';
//   comments.forEach(c => {
//     const li = document.createElement('li');
//     li.textContent = `${c.author}: ${c.comment}`;
//     list.appendChild(li);
//   });
// }

// async function addComment() {
//   const comment = document.getElementById('newComment').value;
//   if (!comment) return;
//   await fetch(`${api}/comments`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ comment, taskId: selectedTaskId, author: localStorage.getItem('username') })
//   });
//   document.getElementById('newComment').value = '';
//   loadComments();
// }

// loadGroups();

const api = 'http://localhost:5000/api';
document.getElementById('user').innerText = localStorage.getItem('username');
let selectedGroupId = null;
let selectedTaskId = null;

function logout() {
  localStorage.removeItem('username');
  location.href = 'index.html';
}

async function createGroup() {
  const name = prompt("Group name?");
  if (!name) return;
  await fetch(`${api}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, createdBy: localStorage.getItem('username') })
  });
  await loadGroups();
}

async function loadGroups() {
  const res = await fetch(`${api}/groups`);
  const groups = await res.json();
  const list = document.getElementById('groupList');
  list.innerHTML = '';
  groups.forEach(g => {
    const btn = document.createElement('button');
    btn.textContent = g.name;
    // Use g._id instead of g.id
    btn.onclick = () => selectGroup(g._id, g.name);
    list.appendChild(btn);
  });
}

async function selectGroup(groupId, groupName) {
  selectedGroupId = groupId;
  document.getElementById('taskSection').style.display = 'block';
  document.getElementById('groupTitle').innerText = groupName;
  loadTasks();
}

async function createTask() {
  const title = prompt("Task title?");
  if (!title) return;
  const assignedTo = prompt("Assign to (username)?");
  const fileInput = document.getElementById('taskFile');
  const file = fileInput ? fileInput.files[0] : null;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('assignedTo', assignedTo);
  formData.append('groupId', selectedGroupId);
  if (file) {
    formData.append('file', file);
  }

  await fetch(`${api}/tasks`, {
    method: 'POST',
    body: formData
  });

  if (fileInput) fileInput.value = '';
  await loadTasks();
}

async function loadTasks() {
  const res = await fetch(`${api}/tasks/${selectedGroupId}`);
  const tasks = await res.json();
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    li.textContent = `${t.title} (assigned to ${t.assignedTo})`;
    li.onclick = () => selectTask(t._id, t.title);
    if (t.attachment) {
      const link = document.createElement('a');
      link.href = t.attachment;
      link.target = '_blank';
      link.textContent = ' [📎 Attachment]';
      li.appendChild(link);
    }
    list.appendChild(li);
  });
}

async function selectTask(taskId, taskTitle) {
  selectedTaskId = taskId;
  document.getElementById('taskTitle').innerText = taskTitle;
  document.getElementById('commentSection').style.display = 'block';
  loadComments();
}

async function loadComments() {
  const res = await fetch(`${api}/comments/${selectedTaskId}`);
  const comments = await res.json();
  const list = document.getElementById('commentList');
  list.innerHTML = '';
  comments.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `${c.author}: ${c.comment}`;
    list.appendChild(li);
  });
}

async function addComment() {
  const comment = document.getElementById('newComment').value;
  if (!comment) return;
  await fetch(`${api}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment, taskId: selectedTaskId, author: localStorage.getItem('username') })
  });
  document.getElementById('newComment').value = '';
  loadComments();
}

loadGroups();
