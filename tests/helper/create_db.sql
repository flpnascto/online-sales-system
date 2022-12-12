DROP TABLE IF EXISTS sales_system.products;
DROP TABLE IF EXISTS sales_system.orders;
DROP TABLE IF EXISTS sales_system.coupons;
DROP SCHEMA IF EXISTS sales_system;

CREATE SCHEMA sales_system;

CREATE TABLE sales_system.products(
	id SERIAL PRIMARY KEY,
	description TEXT,
	price NUMERIC
);

INSERT INTO sales_system.products (id, description, price) VALUES
(1, 'PRODUTO A', 10),
(2, 'PRODUTO B', 20),
(3, 'PRODUTO C', 30);

CREATE TABLE sales_system.orders(
	id SERIAL PRIMARY KEY,
	total_price NUMERIC
);

CREATE TABLE sales_system.coupons(
	id SERIAL PRIMARY KEY,
	description TEXT,
	percentage NUMERIC,
	expire_date TIMESTAMP
);

INSERT INTO sales_system.coupons (id, description, percentage, expire_date) VALUES
(1, 'COUPON10', 10, '2022-12-20 00:00:00'),
(2, 'COUPON_EXPIRED', 14, '2021-01-01 00:00:00');