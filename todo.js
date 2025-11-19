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
    
    const prioritySelect = document.getElementById('prioritySelect');
    const priority = prioritySelect ? prioritySelect.value : 'medium';
    
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: priority
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

// Función de ordenamiento
function sortTodos(todosArray) {
    const sorted = [...todosArray];
    if (sortOrder === 'alphabetical') {
        return sorted.sort((a, b) => a.text.localeCompare(b.text));
    } else if (sortOrder === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => {
            const aPriority = priorityOrder[a.priority || 'medium'];
            const bPriority = priorityOrder[b.priority || 'medium'];
            return bPriority - aPriority;
        });
    }
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    
    filteredTodos = sortTodos(filteredTodos);
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const priorityClass = `priority-${todo.priority || 'medium'}`;
        const priorityText = todo.priority === 'high' ? 'Alta' : todo.priority === 'low' ? 'Baja' : 'Media';
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
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

// Limpiar todas las tareas completadas
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    renderTodos();
    updateStats();
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

// Event listener para ordenamiento
const sortSelect = document.getElementById('sortSelect');
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        sortOrder = e.target.value;
        renderTodos();
    });
}

// Inicializar aplicación
loadTodos();

