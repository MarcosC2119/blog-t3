// Estado de la aplicación
let todos = [];
let currentFilter = 'all';
let sortOrder = 'date'; // 'date', 'alphabetical', 'priority'

// Elementos del DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');

// Cargar tareas desde localStorage
function loadTodos() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
    }
    renderTodos();
    updateStats();
}

// Guardar tareas en localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Agregar nueva tarea
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
    updateStats();
}

// Eliminar tarea
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// Toggle completado
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
    updateStats();
}

// Editar tarea
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    const newText = prompt('Editar tarea:', todo.text);
    if (newText && newText.trim() !== '') {
        todo.text = newText.trim();
        saveTodos();
        renderTodos();
    }
}

// Renderizar tareas
function renderTodos() {
    todoList.innerHTML = '';
    
    let filteredTodos = todos;
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="btn-edit" onclick="editTodo(${todo.id})">Editar</button>
                <button class="btn-delete" onclick="deleteTodo(${todo.id})">Eliminar</button>
            </div>
        `;
        
        todoList.appendChild(li);
    });
}

// Actualizar estadísticas
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completadas: ${completed}`;
    pendingTasks.textContent = `Pendientes: ${pending}`;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filtrar tareas
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    renderTodos();
}

// Event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setFilter(btn.dataset.filter);
    });
});

// Inicializar aplicación
loadTodos();

