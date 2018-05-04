create database bamazon;
use bamazon;

create table products(
id int not null auto_increment,
item_id varchar(6) not null,
product_name varchar(100) not null,
department_name varchar(50) not null,
price decimal(8,2) not null,
stock_quantity int(100) not null,
primary key(id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (696969, "Deadpool Costume",  "Apparel",  99.99, 19);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (531997, "Spalding Basketball",  "Sporting Goods",  29.99, 15);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (213674, "MCU: The First 10 Years Bundle",  "Movies",  290.00, 6);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (301937, "Nintendo Switch",  "Electronics",  349.99, 13);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (420486, "Thor Action Figure",  "Toys",  19.99, 30);

insert into products (item_id, product_name, department_name, price, stock_quantity) values (125235, "Neon Lights Set",  "Automobile",  49.99, 50);

create table departments(
department_id int not null auto_increment,
department_name varchar(50) not null,
over_head_costs decimal(10,2) not null,
product_sales decimal(10,2),
total_profit decimal(10,2),
primary key (department_id)
);

insert into departments (department_name, over_head_costs) values ("Automobile", 10000);
insert into departments (department_name, over_head_costs) values ("Movies", 25000);
insert into departments (department_name, over_head_costs) values ("Electronics", 75000);
insert into departments (department_name, over_head_costs) values ("Toys", 12000);
insert into departments (department_name, over_head_costs) values ("Sporting Goods", 13000);
insert into departments (department_name, over_head_costs) values ("Apparel", 33000);