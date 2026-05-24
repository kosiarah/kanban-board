import { useState } from 'react';
import { PRIORITY_CONFIG } from '../constants';

function TaskModal({ mode, task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '');
  const [notes, setNotes] = useState(task?.notes || '');
  const [priority, setPriority] = useState(task?.priority ?? 2);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, notes, priority: parseInt(priority) });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'add' ? 'New Task' : 'Edit Task'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any details or context..."
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <div className="priority-options">
              {Object.entries(PRIORITY_CONFIG).map(([p, { label, color }]) => {
                const pNum = parseInt(p);
                return (
                  <button
                    type="button"
                    key={p}
                    className={`priority-option${priority === pNum ? ' selected' : ''}`}
                    style={priority === pNum ? { borderColor: color, color, background: color + '18' } : {}}
                    onClick={() => setPriority(pNum)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
