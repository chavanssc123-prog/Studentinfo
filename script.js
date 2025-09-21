async function fetchStudents() {
  const res = await fetch('/api/students');
  const students = await res.json();
  const list = document.getElementById('list');
  if (!students.length) {
    list.innerHTML = '<i>No students yet</i>';
    return;
  }
  list.innerHTML = students.map(s => `
    <div class="student">
      <strong>${s.name}</strong> — Roll: ${s.roll} — Class: ${s.class || ''} — Age: ${s.age || ''}
    </div>
  `).join('');
}

document.getElementById('studentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value.trim(),
    roll: document.getElementById('roll').value.trim(),
    className: document.getElementById('className').value.trim(),
    age: document.getElementById('age').value.trim()
  };
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (res.ok) {
    document.getElementById('studentForm').reset();
    await fetchStudents();
  } else {
    const err = await res.json();
    alert(err.error || 'Error');
  }
});

fetchStudents();