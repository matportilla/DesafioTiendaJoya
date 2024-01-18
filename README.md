Desafio Tienda de Joyas - Desafio Latam
Paula Marti - Matias Portilla - Nicolas Arratia

1 - Clonar repositorio
2 - Llenar datos de Postgres

3 - //Crear Base de Datos con la siguiente estructura

CREATE DATABASE joyas; 

\c joyas;

CREATE TABLE inventario (
    id SERIAL, 
    nombre VARCHAR(50), 
    categoria VARCHAR(50), 
    metal VARCHAR(50), 
    precio INT, 
    stock INT);

//Insertar Datos 

INSERT INTO inventario values
(DEFAULT, 'Collar Heart', 'collar', 'oro', 20000 , 2), 
(DEFAULT, 'Collar History', 'collar', 'plata', 15000 , 5), 
(DEFAULT, 'Aros Berry', 'aros', 'oro', 12000 , 10),
(DEFAULT, 'Aros Hook Blue', 'aros', 'oro', 25000 , 4), 
(DEFAULT, 'Anillo Wish', 'aros', 'plata', 30000 , 4), 
(DEFAULT, 'Anillo Cuarzo Greece', 'anillo', 'oro', 40000 , 2);
