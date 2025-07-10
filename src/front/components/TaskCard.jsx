import React from "react";

/**
 * TaskCard Component
 * @param {{
 *   task: { id: number; label: string; completed: boolean },
 *   onToggleComplete: (id: number) => void,
 *   onDelete: (id: number) => void,
 *   onEdit: (id: number) => void
 * }} props
 */
const TaskCard = ({ task, onToggleComplete, onDelete, onEdit }) => {
    return (
        <div className="card mb-2">
            <div className="card-body d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <input
                        type="checkbox"
                        className="form-check-input me-2 border-black"
                        checked={task.completed}
                        onChange={() => onToggleComplete(task.id)}
                    />
                    <span
                        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                    >
                        {task.label}
                    </span>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </button>
                    <button className="btn btn-sm btn-warning" onClick={() => onEdit(task.id)}>
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
