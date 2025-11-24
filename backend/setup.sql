-- 1. Create the Database
CREATE DATABASE compshop_db;
USE compshop_db;

-- 2. Create User Roles Table
CREATE TABLE user_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

-- 3. Create Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

-- 4. Create Computer Stations Table
CREATE TABLE computer_stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    station_number INT NOT NULL,
    status ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available'
);

-- 5. Insert dummy data
INSERT INTO user_roles (role_name) VALUES ('Admin'), ('Staff'), ('Customer');
INSERT INTO computer_stations (station_number) VALUES (1), (2), (3), (4), (5);
