-- Создать таблицу "Проекты"
CREATE TABLE Projects (
  project_id INT NOT NULL AUTO_INCREMENT,
  project_name VARCHAR(255) NOT NULL,
  project_description VARCHAR(255),
  project_start_date DATE,
  project_end_date DATE,
  PRIMARY KEY (project_id)
);

-- Создать таблицу "Задачи"
CREATE TABLE Tasks (
  task_id INT NOT NULL AUTO_INCREMENT,
  task_name VARCHAR(255) NOT NULL,
  task_description VARCHAR(255),
  task_status VARCHAR(255),
  task_created_date DATE,
  project_id INT NOT NULL,
  PRIMARY KEY (task_id),
  FOREIGN KEY (project_id) REFERENCES Projects (project_id)
);
