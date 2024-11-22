const API_URL = 'http://localhost:3000/api/tasks';

// Función para obtener y mostrar las tareas
async function fetchTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong>
            <span>${task.description}</span>
            <button class="delete-btn" data-id="${task.id}">Eliminar</button>
        `;
        taskList.appendChild(li);
    });

    // Agregar eventos a los botones de eliminar
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            await deleteTask(id);
            fetchTasks(); // Actualizar la lista después de eliminar
        });
    });
}

// Función para eliminar una tarea
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
}

// Enviar nueva tarea
document.getElementById('taskForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
    });

    // Limpiar formulario y actualizar lista de tareas
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    fetchTasks();
});

// Cargar tareas al iniciar
fetchTasks();