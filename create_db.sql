DROP DATABASE IF EXISTS sales_system;
CREATE DATABASE sales_system;

DROP TABLE IF EXISTS sales_system.products;
CREATE TABLE sales_system.products(
	id INTEGER AUTOINCREMENT,
	description TEXT,
	price NUMERIC
  PRIMARY KEY (id)
);

INSERT INTO sales_system.products (id, description, price) VALUES
(1, 'PRODUTO A', 10),
(2, 'PRODUTO A', 20),
(3, 'PRODUTO A', 30);

CREATE TABLE sales_system.orders(
	id SERIAL PRIMARY KEY,
	total_price NUMERIC
);