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
        try {
            todos = JSON.parse(stored);
            // Migrar tareas antiguas sin prioridad
            todos = todos.map(todo => ({
                ...todo,
                priority: todo.priority || 'medium'
            }));
        } catch (e) {
            console.error('Error al cargar tareas:', e);
            todos = [];
        }
    }
    renderTodos();
    updateStats();
}

// Guardar tareas en localStorage
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
        localStorage.setItem('lastSaved', new Date().toISOString());
    } catch (e) {
        console.error('Error al guardar tareas:', e);
        alert('Error al guardar las tareas. El almacenamiento puede estar lleno.');
    }
}

// Validar entrada de tarea
function validateTodo(text) {
    if (!text || text.trim() === '') {
        return { valid: false, error: 'La tarea no puede estar vacía' };
    }
    if (text.length > 200) {
        return { valid: false, error: 'La tarea no puede tener más de 200 caracteres' };
    }
    return { valid: true };
}

// Agregar nueva tarea
function addTodo() {
    const text = todoInput.value.trim();
    const validation = validateTodo(text);
    
    if (!validation.valid) {
        alert(validation.error);
        return;
    }
    
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
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Toggle completado
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            const updated = { ...todo, completed: !todo.completed };
            if (updated.completed) {
                updated.completedAt = new Date().toISOString();
            } else {
                delete updated.completedAt;
            }
            return updated;
        }
        return todo;
    });
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
        todo.updatedAt = new Date().toISOString();
        saveTodos();
        renderTodos();
    }
}

// Cambiar prioridad de una tarea
function changePriority(id, newPriority) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.priority = newPriority;
        saveTodos();
        renderTodos();
    }
}

// Función de ordenamiento
function sortTodos(todosArray) {
    const sorted = [...todosArray];
    if (sortOrder === 'alphabetical') {
        return sorted.sort((a, b) => {
            const textA = a.text.toLowerCase();
            const textB = b.text.toLowerCase();
            return textA.localeCompare(textB);
        });
    } else if (sortOrder === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => {
            const aPriority = priorityOrder[a.priority || 'medium'];
            const bPriority = priorityOrder[b.priority || 'medium'];
            if (bPriority !== aPriority) {
                return bPriority - aPriority;
            }
            // Si tienen la misma prioridad, ordenar por fecha
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }
    // Ordenar por fecha (más recientes primero)
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
    
    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = currentFilter === 'all' 
            ? 'No hay tareas. ¡Agrega una nueva!' 
            : currentFilter === 'completed'
            ? 'No hay tareas completadas'
            : 'No hay tareas pendientes';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        const priorityClass = `priority-${todo.priority || 'medium'}`;
        const priorityText = todo.priority === 'high' ? 'Alta' : todo.priority === 'low' ? 'Baja' : 'Media';
        
        const dateInfo = todo.completedAt 
            ? `<span class="date-info">Completada: ${formatDate(todo.completedAt)}</span>`
            : `<span class="date-info">Creada: ${formatDate(todo.createdAt)}</span>`;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <div class="todo-content">
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                ${dateInfo}
            </div>
            <span class="priority-badge ${priorityClass}">${priorityText}</span>
            <div class="todo-actions">
                <select class="priority-change" onchange="changePriority(${todo.id}, this.value)">
                    <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Baja</option>
                    <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Media</option>
                    <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>Alta</option>
                </select>
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
    const highPriority = todos.filter(t => t.priority === 'high' && !t.completed).length;
    
    totalTasks.textContent = `Total: ${total}`;
    completedTasks.textContent = `Completadas: ${completed}`;
    pendingTasks.textContent = `Pendientes: ${pending}`;
    
    // Agregar indicador de alta prioridad si existe
    if (highPriority > 0 && !document.getElementById('highPriorityAlert')) {
        const alert = document.createElement('div');
        alert.id = 'highPriorityAlert';
        alert.className = 'high-priority-alert';
        alert.textContent = `⚠️ ${highPriority} tarea(s) de alta prioridad pendiente(s)`;
        document.querySelector('.container').insertBefore(alert, todoList);
    } else if (highPriority === 0) {
        const alert = document.getElementById('highPriorityAlert');
        if (alert) alert.remove();
    }
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Hace un momento';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} días`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

// Limpiar todas las tareas completadas
function clearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No hay tareas completadas para limpiar');
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar ${completedCount} tarea(s) completada(s)?`)) {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
        updateStats();
    }
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

// Prevenir envío de formulario accidental
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.container');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            addTodo();
        });
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

// Event listener para limpiar completadas
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener('click', clearCompleted);
}

// Event listeners para exportar e importar
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', exportTodos);
}

const importBtn = document.getElementById('importBtn');
if (importBtn) {
    importBtn.addEventListener('click', importTodos);
}

// Función para exportar tareas
function exportTodos() {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Función para importar tareas
function importTodos() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    if (confirm('¿Reemplazar todas las tareas actuales con las importadas?')) {
                        todos = imported;
                        saveTodos();
                        renderTodos();
                        updateStats();
                        alert('Tareas importadas correctamente');
                    }
                } else {
                    alert('El archivo no tiene un formato válido');
                }
            } catch (error) {
                alert('Error al importar el archivo: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Inicializar aplicación
loadTodos();

