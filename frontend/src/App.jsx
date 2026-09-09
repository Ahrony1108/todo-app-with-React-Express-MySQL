import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    try {
      setError("");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to load todos");
      setTodos(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    try {
      setError("");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: cleanTitle })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || "Failed to create todo");
      }
      const newTodo = await response.json();
      setTodos((current) => [newTodo, ...current]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: todo.title,
          completed: !Boolean(todo.completed)
        })
      });
      if (!response.ok) throw new Error("Failed to update todo");
      const updatedTodo = await response.json();
      setTodos((current) =>
        current.map((item) => item.id === updatedTodo.id ? updatedTodo : item)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      setError("");
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete todo");
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const completedCount = todos.filter((todo) => Boolean(todo.completed)).length;

  return (
    <main className="app">
      <section className="todo-container">
        <div className="header">
          <div>
            <p className="eyebrow">FULL-STACK DEMO</p>
            <h1>Todo Application</h1>
            <p className="subtitle">React + Express + MySQL</p>
          </div>
          <div className="stats">
            <strong>{completedCount}</strong>
            <span>done</span>
          </div>
        </div>

        <form className="todo-form" onSubmit={addTodo}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to be done?"
            aria-label="Todo title"
          />
          <button type="submit">Add Todo</button>
        </form>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <p className="message">Loading todos...</p>
        ) : todos.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">✓</div>
            <h2>No todos yet</h2>
            <p>Add your first task above.</p>
          </div>
        ) : (
          <div className="todo-list">
            {todos.map((todo) => (
              <article
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <label className="todo-content">
                  <input
                    type="checkbox"
                    checked={Boolean(todo.completed)}
                    onChange={() => toggleTodo(todo)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                  type="button"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}

        <footer>
          <span>{todos.length} total task{todos.length === 1 ? "" : "s"}</span>
          <span>API: /api/todos</span>
        </footer>
      </section>
    </main>
  );
}

export default App;