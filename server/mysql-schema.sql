-- Base de datos MySQL para la tienda

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(36) NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images JSON NOT NULL DEFAULT (json_array()),
  sizes JSON NOT NULL DEFAULT (json_array()),
  colors JSON NOT NULL DEFAULT (json_array()),
  category TEXT NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) NOT NULL,
  username VARCHAR(191) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'ADMIN',
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS configuration (
  id VARCHAR(36) NOT NULL,
  `key` VARCHAR(191) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Datos iniciales
INSERT INTO admins (id, username, password, role)
VALUES (UUID(), 'admin', '$2b$10$la/J5gZR9tuKMevP/A.RKuqmThyU/P9mrBPyyTfiG2YXNtGi2SN0G', 'ADMIN')
ON DUPLICATE KEY UPDATE username = VALUES(username);

INSERT INTO configuration (id, `key`, value)
VALUES (UUID(), 'whatsapp_number', '+5491112345678')
ON DUPLICATE KEY UPDATE value = VALUES(value);

INSERT INTO products (id, name, description, price, images, sizes, colors, category, stock, featured)
VALUES
  (UUID(),
   'Zapatillas Urbanas',
   'Calzado cómodo para uso diario con suela antideslizante.',
   89.99,
   JSON_ARRAY('https://via.placeholder.com/640x480?text=Zapatillas'),
   JSON_ARRAY('38', '40', '42'),
   JSON_ARRAY('Negro', 'Blanco'),
   'Calzado',
   25,
   TRUE),
  (UUID(),
   'Remera Oversize',
   'Remera de algodón peinado con corte relajado.',
   34.50,
   JSON_ARRAY('https://via.placeholder.com/640x480?text=Remera'),
   JSON_ARRAY('S', 'M', 'L', 'XL'),
   JSON_ARRAY('Negro', 'Gris', 'Azul'),
   'Indumentaria',
   40,
   FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name);
