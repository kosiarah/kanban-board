import { useMemo, useState } from 'react';
import { COLUMN_CONFIG, PRIORITY_CONFIG } from '../constants';

function Column({ status, tasks, onAdd, onDelete, onMove, onEdit }) {
  const { label, accent } = COLUMN_CONFIG[status];
  const sorted = useMemo(() => [...tasks].sort((a, b) => a.priority - b.priority), [tasks]);
  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(e) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const taskId = e.dataTransfer.getData('taskId');
    const fromStatus = e.dataTransfer.getData('fromStatus');
    if (fromStatus !== status) onMove(taskId, status);
  }

  return (
    <div
      className={`column${dragOver ? ' drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header" style={{ borderTopColor: accent }}>
        <div className="column-title-row">
          <h2 className="column-title">{label}</h2>
          <span className="column-count" style={{ background: accent + '22', color: accent }}>{tasks.length}</span>
        </div>
      </div>
      <div className="task-list">
        {sorted.map(task => {
          const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[2];
          return (
            <div
              className="task-card"
              key={task.id}
              draggable
              style={{ borderLeftColor: p.color }}
              onDragStart={e => {
                e.dataTransfer.setData('taskId', task.id);
                e.dataTransfer.setData('fromStatus', status);
              }}
            >
              <div className="task-card-top">
                <span className="priority-badge" style={{ color: p.color, background: p.color + '20' }}>
                  {p.label}
                </span>
                <div className="task-actions">
                  {status !== 'todo' && (
                    <button className="icon-btn" title="Move left" onClick={() => onMove(task.id, status === 'done' ? 'inprogress' : 'todo')}>←</button>
                  )}
                  {status !== 'done' && (
                    <button className="icon-btn" title="Move right" onClick={() => onMove(task.id, status === 'todo' ? 'inprogress' : 'done')}>→</button>
                  )}
                  <button className="icon-btn edit-btn" title="Edit" onClick={() => onEdit(task)}>✎</button>
                  <button className="icon-btn delete-btn" title="Delete" onClick={() => onDelete(task.id)}>✕</button>
                </div>
              </div>
              <p className="task-title">{task.title}</p>
              {task.notes && <p className="task-notes">{task.notes}</p>}
            </div>
          );
        })}
      </div>
      <button className="add-btn" onClick={onAdd}>+ Add Task</button>
    </div>
  );
}

export default Column;
