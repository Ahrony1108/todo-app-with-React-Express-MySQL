CREATE DATABASE IF NOT EXISTS todo_db;

USE todo_db;

CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (title, completed)
SELECT 'Learn Docker', FALSE
WHERE NOT EXISTS (SELECT 1 FROM todos);

INSERT INTO todos (title, completed)
SELECT 'Learn Jenkins', FALSE
WHERE NOT EXISTS (SELECT 1 FROM todos WHERE title = 'Learn Jenkins');

INSERT INTO todos (title, completed)
SELECT 'Learn Kubernetes', FALSE
WHERE NOT EXISTS (SELECT 1 FROM todos WHERE title = 'Learn Kubernetes');