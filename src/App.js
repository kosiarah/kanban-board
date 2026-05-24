import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { COLUMN_CONFIG } from './constants';
import Column from './components/Column';
import TaskModal from './components/TaskModal';
import './App.css';

const COLUMNS = ['todo', 'inprogress', 'done'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks').select('*').order('priority');
    if (error) setError('Failed to load tasks.');
    else setTasks(data);
    setLoading(false);
  }

  function addTask(status) {
    setModal({ mode: 'add', status });
  }

  function handleEditTask(task) {
    setModal({ mode: 'edit', task });
  }

  async function handleSaveNew({ title, notes, priority }) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, notes, priority, status: modal.status }])
      .select();
    if (error) { setError('Failed to add task.'); return; }
    setTasks(prev => [...prev, data[0]]);
    setModal(null);
  }

  async function handleSaveEdit({ title, notes, priority }) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ title, notes, priority })
      .eq('id', modal.task.id)
      .select();
    if (error) { setError('Failed to update task.'); return; }
    setTasks(prev => prev.map(t => t.id === modal.task.id ? data[0] : t));
    setModal(null);
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { setError('Failed to delete task.'); return; }
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  async function moveTask(id, newStatus) {
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (error) { setError('Failed to move task.'); return; }
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <div className="logo-icon">K</div>
            <span>Kanban</span>
          </div>
          <div className="header-stats">
            {COLUMNS.map(col => (
              <div className="stat" key={col}>
                <span className="stat-num" style={{ color: COLUMN_CONFIG[col].accent }}>{tasks.filter(t => t.status === col).length}</span>
                <span className="stat-label">{col === 'inprogress' ? 'In Progress' : col.charAt(0).toUpperCase() + col.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </header>
      {error && (
        <div className="error-banner">
          {error}
          <button className="error-dismiss" onClick={() => setError(null)}>✕</button>
        </div>
      )}
      <main className="board-wrapper">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            Loading tasks...
          </div>
        ) : (
          <div className="board">
            {COLUMNS.map(col => (
              <Column
                key={col}
                status={col}
                tasks={tasks.filter(t => t.status === col)}
                onAdd={() => addTask(col)}
                onDelete={deleteTask}
                onMove={moveTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </main>
      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onSave={modal.mode === 'add' ? handleSaveNew : handleSaveEdit}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

export default App;
