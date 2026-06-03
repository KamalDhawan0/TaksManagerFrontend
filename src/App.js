import './App.css';
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';


function Toast({ msg, type }) {
  return (
    <div className={`toast${msg ? " show" : ""}${type === "err" ? " err" : ""}`}>
      {msg}
    </div>
  );
}

function App() {
  const [connStatus, setConnStatus] = useState("idle");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "" });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  async function fetchTasks() {
    try {
      const { data } = await axios.get(`${BASE_URL}/tasks`);
      setTasks(data);
      setConnStatus("ok");
    } catch {
      setConnStatus("err");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, [BASE_URL]);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2500);
  }, []);

  async function addTask() {
    if (!title.trim()) return;
    setAdding(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/tasks`, { title: title.trim(), description: desc.trim() });
      setTasks((prev) => [data, ...prev]);
      setTitle(""); setDesc("");
      showToast("Task added!");
    } catch { showToast("Failed to add task", "err"); }
    setAdding(false);
  }

  async function toggleTask(id) {
    try {
      const { data } = await axios.patch(`${BASE_URL}/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch { showToast("Failed to update", "err"); }
  }

  async function deleteTask(id) {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast("Task deleted");
    } catch { showToast("Failed to delete", "err"); }
  }

  function startEdit(t) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description || "");
  }

  async function saveEdit(id) {
    if (!editTitle.trim()) return;
    try {
      const { data } = await axios.patch(`${BASE_URL}/tasks/${id}`, { title: editTitle.trim(), description: editDesc.trim() });
      setTasks((prev) => prev.map((t) => (t.id === id ? data : t)));
      setEditingId(null);
      showToast("Task updated!");
    } catch { showToast("Failed to update", "err"); }
  }
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.completed === true).length;
  const activeCount = total - doneCount;

  const filtered = tasks.filter((t) => {
    if (filter === "active") return t.completed !== true;
    if (filter === "completed") return t.completed === true;
    return true;
  });

  return (
    <>
      <div className="app">
        <div className="header">
          <h1>task<span>.</span>manager</h1>
        </div>


        <div className="stats">
          <div className="stat"><div className="stat-label">total</div><div className="stat-val purple">{total}</div></div>
          <div className="stat"><div className="stat-label">active</div><div className="stat-val blue">{activeCount}</div></div>
          <div className="stat"><div className="stat-label">done</div><div className="stat-val green">{doneCount}</div></div>
        </div>

        <div className="add-box">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Task title..."
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)..."
          />
          <button className="add-btn" onClick={addTask} disabled={adding || !title.trim()}>
            + add task
          </button>
        </div>

        <div className="filter-row">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty">// no tasks here</div>
          ) : (
            filtered.map((t) => {
              const isDone = t.completed === true;
              return (
                <div key={t.id} className={`task-card${isDone ? " done" : ""}`}>
                  {editingId === t.id ? (
                    <>
                      <input className="edit-input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                      <input className="edit-input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description..." />
                      <div className="task-actions">
                        <button className="icon-btn" onClick={() => setEditingId(null)}>✕ cancel</button>
                        <button className="icon-btn save" onClick={() => saveEdit(t.id)}>✓ save</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="task-top">
                        <button className={`toggle${isDone ? " checked" : ""}`} onClick={() => toggleTask(t.id)} aria-label={isDone ? "Mark active" : "Mark complete"}>
                          {isDone ? "✓" : ""}
                        </button>
                        <div className="task-body">
                          <div className={`task-title${isDone ? " striked" : ""}`}>
                            {t.title}
                            <span className={`badge ${isDone ? "completed" : "active"}`}>{isDone ? "done" : "active"}</span>
                          </div>
                          {t.description && <div className="task-desc">{t.description}</div>}
                        </div>
                      </div>
                      <div className="task-actions">
                        <button className="icon-btn" onClick={() => startEdit(t)}>✎ edit</button>
                        <button className="icon-btn danger" onClick={() => deleteTask(t.id)}>✕ delete</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} />
    </>
  );
}

export default App;
