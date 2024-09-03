import './App.css';
import { useState, useEffect } from 'react';

function App() {
  // Existing states
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newCategory, setNewCategory] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDueDate, setEditingDueDate] = useState('');
  const [editingPriority, setEditingPriority] = useState('Medium');
  const [editingCategory, setEditingCategory] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState(['Work', 'Personal', 'Shopping']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // New state for dark mode
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const updatedTasks = [
        ...tasks,
        {
          text: newTask.trim(),
          dueDate: newDueDate,
          priority: newPriority,
          category: newCategory,
          completed: false,
        },
      ];
      setTasks(updatedTasks);
      setNewTask('');
      setNewDueDate('');
      setNewPriority('Medium');
      setNewCategory('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingText(tasks[index].text);
    setEditingDueDate(tasks[index].dueDate);
    setEditingPriority(tasks[index].priority);
    setEditingCategory(tasks[index].category);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText('');
    setEditingDueDate('');
    setEditingPriority('Medium');
    setEditingCategory('');
  };

  const saveTask = (index) => {
    if (editingText.trim()) {
      const updatedTasks = tasks.map((task, i) =>
        i === index
          ? {
              ...task,
              text: editingText.trim(),
              dueDate: editingDueDate,
              priority: editingPriority,
              category: editingCategory,
            }
          : task
      );
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingText('');
      setEditingDueDate('');
      setEditingPriority('Medium');
      setEditingCategory('');
    }
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'high-priority';
      case 'Medium':
        return 'medium-priority';
      case 'Low':
        return 'low-priority';
      default:
        return '';
    }
  };

  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case 'all':
        return true;
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      default:
        return true;
    }
  });

  const searchedTasks = filteredTasks.filter((task) => {
    return task.text.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const categorizedTasks = searchedTasks.filter((task) => {
    if (selectedCategory === 'All') {
      return true;
    } else {
      return task.category === selectedCategory;
    }
  });

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1>To-Do List</h1>
      <button onClick={toggleDarkMode}>
        Switch to {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <input
        type="date"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
      />
      <select
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>
      <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
      <button onClick={addTask}>Add Task</button>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks"
      />
      <ul>
        {categorizedTasks.map((task, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <input
                  type="date"
                  value={editingDueDate}
                  onChange={(e) => setEditingDueDate(e.target.value)}
                />
                <select
                  value={editingPriority}
                  onChange={(e) => setEditingPriority(e.target.value)}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <select
                  value={editingCategory}
                  onChange={(e) => setEditingCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button onClick={() => saveTask(index)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                >
                  {task.text} (Due: {task.dueDate || 'No due date'})
                </span>
                <span className={`priority-label ${getPriorityClass(task.priority)}`}>
                  [{task.priority}]
                </span>
                <button onClick={() => toggleComplete(index)}>
                  {task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onClick={() => startEditing(index)}>Edit</button>
                <button onClick={() => deleteTask(index)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <footer>
      <p>Designed by Vishal  - 2024

      </p>
    </footer>
    </div>
  );
}

export default App;
