"use client";

import { useState, useEffect, useMemo } from "react";
import { Todo, Filter, Priority } from "@/lib/types";
import { loadTodos, saveTodos, generateId } from "@/lib/storage";
import TodoItem from "./TodoItem";
import styles from "./TodoApp.module.css";

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveTodos(todos);
  }, [todos, mounted]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    };
    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTodo = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  const filtered = useMemo(() => {
    return todos.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    });
  }, [todos, filter]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Todos</h1>
        {mounted && (
          <p className={styles.subtitle}>
            {activeCount} remaining · {completedCount} done
          </p>
        )}
      </header>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="List all the things to do today"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          maxLength={200}
        />
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          aria-label="Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button className={styles.addBtn} onClick={addTodo}>
          Add
        </button>
      </div>

      <div className={styles.filters}>
        {(["all", "active", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        {completedCount > 0 && (
          <button className={styles.clearBtn} onClick={clearCompleted}>
            Clear done
          </button>
        )}
      </div>

      <div className={styles.list}>
        {!mounted ? null : filtered.length === 0 ? (
          <div className={styles.empty}>
            {filter === "completed"
              ? "Nothing completed yet."
              : filter === "active"
              ? "All done!"
              : "Add your first todo above."}
          </div>
        ) : (
          filtered.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}
