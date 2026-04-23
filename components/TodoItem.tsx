"use client";

import { Todo, Priority } from "@/lib/types";
import styles from "./TodoItem.module.css";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityLabel: Record<Priority, string> = {
  low: "low",
  medium: "med",
  high: "high",
};

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div className={`${styles.item} ${todo.completed ? styles.completed : ""}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
      >
        {todo.completed ? "✓" : ""}
      </button>

      <span className={styles.text}>{todo.text}</span>

      <span className={`${styles.priority} ${styles[todo.priority]}`}>
        {priorityLabel[todo.priority]}
      </span>

      <button
        className={styles.delete}
        onClick={() => onDelete(todo.id)}
        aria-label="Delete todo"
      >
        ×
      </button>
    </div>
  );
}
