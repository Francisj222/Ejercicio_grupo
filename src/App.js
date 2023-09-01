// Importa React y los hooks useState y useEffect desde la librería 'react'
import React, { useState, useEffect } from 'react';

// Importa componentes relacionados con la navegación
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa el archivo de estilos 'App.css'
import './App.css';

// Importa funciones y componentes de Redux
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

// Acción para agregar una tarea
const addTaskAction = (task) => ({
  type: 'ADD_TASK',
  payload: task,
});

// Reducer para gestionar el estado de las tareas
const initialState = {
  tasks: [], // Inicialmente, no hay tareas
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    default:
      return state;
  }
};

// Función para cargar las tareas desde Local Storage
const loadTasksFromLocalStorage = () => {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : [];
};

// Crea la tienda Redux con el reducer y carga las tareas desde Local Storage
const store = createStore(
  taskReducer,
  { tasks: loadTasksFromLocalStorage() },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// Componente TaskForm conectado a Redux para agregar tareas
const ConnectedTaskForm = ({ addTask }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const taskText = e.target.taskText.value;
    if (taskText.trim() !== '') {
      addTask(taskText);
      e.target.taskText.value = '';
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input className="input" type="text" name="taskText" placeholder="Ingrese una nueva tarea" />
      <button className="button" type="submit">
        Agregar tarea
      </button>
    </form>
  );
};

// Conecta el componente TaskForm a Redux y pasa la acción 'addTask' como prop
const TaskForm = connect(null, { addTask: addTaskAction })(ConnectedTaskForm);

// Componente TaskList para mostrar la lista de tareas
const TaskList = ({ tasks }) => (
  <ul className="task-list">
    {tasks.map((task, index) => (
      <li key={index} className="task-item">
        {task}
      </li>
    ))}
  </ul>
);

// Componente principal de la aplicación
const App = () => {
  const [tasks, setTasks] = useState(store.getState().tasks);

  useEffect(() => {
    setTasks(store.getState().tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="app-container">
      <h1 className="main-title">Mi Lista de Tareas</h1>
      <div className="names">
        <p>Madeline Lopez</p>
        <p>Jenner Chavez</p>
        <p>Jonathan Contreras</p>
        <p>Francisco Rabanales</p>
      </div>
      <TaskForm />
      <TaskList tasks={tasks} />
    </div>
  );
};

// Componente que envuelve la aplicación en el contexto de Redux y Router
const AppRouter = () => (
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Puedes agregar más rutas según tus necesidades */}
      </Routes>
    </Router>
  </Provider>
);

export default AppRouter;