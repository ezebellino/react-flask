import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storeReducer, { initialStore } from '../store';
import TaskCard from '../components/TaskCard';

// Página de Tareas: lista, creación, edición y eliminación
const TasksPage = () => {
    const [store, dispatch] = useReducer(storeReducer, undefined, initialStore);
    const [newLabel, setNewLabel] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    // 1) Cargar tareas al montar
    useEffect(() => {
        if (!token) return navigate('/login');
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al cargar tareas');
                }
                const data = await res.json();
                dispatch({ type: 'SET_TODOS', payload: data });
            })
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    }, [token, navigate]);

    // 2) Crear tarea
    const handleCreate = (e) => {
        e.preventDefault();
        if (!newLabel.trim()) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: newLabel })
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al crear tarea');
                }
                return res.json();
            })
            .then(task => {
                dispatch({ type: 'ADD_TODO', payload: task });
                setNewLabel('');
            })
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    };

    // 3) Marcar completada / editar
    const handleToggle = (id, completed) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al actualizar tarea');
                }
                return res.json();
            })
            .then(updated => dispatch({ type: 'UPDATE_TODO', payload: updated }))
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    };

    // 4) Eliminar tarea
    const handleDelete = (id) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al eliminar tarea');
                }
                dispatch({ type: 'REMOVE_TODO', payload: id });
            })
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    };

    // Editar tarea
    const handleEdit = (id) => {
        const task = store.todos.find(t => t.id === id);
        setEditingId(id);
        setEditingText(task.label);
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: task.label })
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al editar tarea');
                }
                return res.json();
            })
            .then(updated => dispatch({ type: 'UPDATE_TODO', payload: updated }))
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    };

    // Guardar cambios
    const handleEditSave = (id) => {
        if (!editingText.trim()) return;
        dispatch({ type: 'SET_LOADING', payload: true });
        fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ label: editingText })
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.msg || 'Error al editar tarea');
                }
                return res.json();
            })
            .then(updated => {
                dispatch({ type: 'UPDATE_TODO', payload: updated });
                setEditingId(null);
                setEditingText("");
            })
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
    };

    // Cancelar edición
    const handleEditCancel = () => {
        setEditingId(null);
        setEditingText("");
    };



    return (
        <div className="container mt-4">
            {/* Bienvenida al usuario */}
            <div className="mb-4 text-center text-light p-3 rounded">
                <h2>Bienvenido, {userData.username || 'Usuario'}</h2>
                <p>Administra tus tareas de manera sencilla y eficiente.</p>
                <h1 className="mb-4">Mis Tareas</h1>
                {store.loading && <div>Loading...</div>}
                {store.error && <div className="alert alert-danger">{store.error}</div>}
                <form onSubmit={handleCreate} className="d-flex mb-3">
                    <input
                        className="form-control me-2"
                        placeholder="Nueva tarea..."
                        value={newLabel}
                        onChange={e => {
                            setNewLabel(e.target.value);
                            dispatch({ type: 'CLEAR_ERROR' });
                        }}
                    />
                    <button className="btn btn-success" type="submit">Agregar</button>
                </form>
                {store.todos.map(todo => (
                    <div key={todo.id}>
                        {editingId === todo.id ? (
                            // MODO EDICIÓN
                            <div className="card mb-2 bg-dark text-light p-3">
                                <div className="d-flex gap-2">
                                    <input
                                        className="form-control bg-secondary text-light"
                                        value={editingText}
                                        onChange={e => setEditingText(e.target.value)}
                                    />
                                    <button className="btn btn-success" onClick={() => handleEditSave(todo.id)}>
                                        Guardar
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleEditCancel}>
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // MODO LECTURA NORMAL
                            <TaskCard
                                task={todo}
                                onToggleComplete={() => handleToggle(todo.id, !todo.completed)}
                                onDelete={() => handleDelete(todo.id)}
                                onEdit={() => handleEdit(todo.id)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;