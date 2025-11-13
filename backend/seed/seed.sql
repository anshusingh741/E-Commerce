-- create database
CREATE DATABASE IF NOT EXISTS shopzone_db;
USE shopzone_db;

-- users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isAdmin TINYINT DEFAULT 0
);

-- products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(500)
);

-- orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_price DECIMAL(10,2),
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- seed products
INSERT INTO products (name, description, price, image) VALUES
('Wireless Headphones', 'Comfortable over-ear headphones with noise cancellation.', 1299.00, 'https://picsum.photos/seed/headphones/300/200'),
('Smart Watch', 'Fitness tracking, notifications, and more.', 2499.00, 'https://picsum.photos/seed/watch/300/200'),
('Bluetooth Speaker', 'Portable speaker with rich sound.', 1799.00, 'https://picsum.photos/seed/speaker/300/200'),
('Running Shoes', 'Lightweight and comfortable.', 2899.00, 'https://picsum.photos/seed/shoes/300/200'),
('Backpack', 'Durable backpack for daily use.', 1199.00, 'https://picsum.photos/seed/backpack/300/200'),
('Sunglasses', 'Stylish UV protected sunglasses.', 899.00, 'https://picsum.photos/seed/sunglasses/300/200');

-- create an admin user (password: admin123)
-- NOTE: password must be bcrypt-hashed. Generate hashed password and then insert.
