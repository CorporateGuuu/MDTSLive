-- Create repair categories tables with nested structure
-- Categories -> Manufacturers -> Devices -> Colors/Problems

-- Main repair categories table
CREATE TABLE IF NOT EXISTS repair_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Manufacturers table (belongs to categories)
CREATE TABLE IF NOT EXISTS manufacturers (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES repair_categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, name)
);

-- Devices table (belongs to manufacturers)
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    manufacturer_id INTEGER NOT NULL REFERENCES manufacturers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    on_site_price DECIMAL(10,2),
    pickup_price DECIMAL(10,2),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(manufacturer_id, name)
);

-- Device colors table (belongs to devices)
CREATE TABLE IF NOT EXISTS device_colors (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, name)
);

-- Device problems/repairs table (belongs to devices)
CREATE TABLE IF NOT EXISTS device_problems (
    id SERIAL PRIMARY KEY,
    device_id INTEGER NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    retail_price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_id, name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manufacturers_category_id ON manufacturers(category_id);
CREATE INDEX IF NOT EXISTS idx_devices_manufacturer_id ON devices(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_device_colors_device_id ON device_colors(device_id);
CREATE INDEX IF NOT EXISTS idx_device_problems_device_id ON device_problems(device_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_repair_categories_updated_at
    BEFORE UPDATE ON repair_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturers_updated_at
    BEFORE UPDATE ON manufacturers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
    BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO repair_categories (name, image) VALUES
('Electronics', 'https://example.com/images/categories/electronics.png'),
('Tablets', 'https://example.com/images/categories/tablets.png'),
('Laptops', 'https://example.com/images/categories/laptops.png')
ON CONFLICT (name) DO NOTHING;

-- Insert sample manufacturers
INSERT INTO manufacturers (category_id, name, image) VALUES
((SELECT id FROM repair_categories WHERE name = 'Electronics'), 'Samsung', 'https://example.com/images/manufacturers/samsung.png'),
((SELECT id FROM repair_categories WHERE name = 'Electronics'), 'Apple', 'https://example.com/images/manufacturers/apple.png'),
((SELECT id FROM repair_categories WHERE name = 'Tablets'), 'Samsung', 'https://example.com/images/manufacturers/samsung.png'),
((SELECT id FROM repair_categories WHERE name = 'Tablets'), 'Apple', 'https://example.com/images/manufacturers/apple.png'),
((SELECT id FROM repair_categories WHERE name = 'Laptops'), 'Dell', 'https://example.com/images/manufacturers/dell.png'),
((SELECT id FROM repair_categories WHERE name = 'Laptops'), 'HP', 'https://example.com/images/manufacturers/hp.png')
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert sample devices
INSERT INTO devices (manufacturer_id, name, on_site_price, pickup_price, image) VALUES
((SELECT id FROM manufacturers WHERE name = 'Samsung' AND category_id = (SELECT id FROM repair_categories WHERE name = 'Electronics')), 'Galaxy S21', 799.99, 749.99, 'https://example.com/images/devices/galaxy_s21.png'),
((SELECT id FROM manufacturers WHERE name = 'Samsung' AND category_id = (SELECT id FROM repair_categories WHERE name = 'Electronics')), 'Galaxy S22', 899.99, 849.99, 'https://example.com/images/devices/galaxy_s22.png'),
((SELECT id FROM manufacturers WHERE name = 'Apple' AND category_id = (SELECT id FROM repair_categories WHERE name = 'Electronics')), 'iPhone 15', 999.99, 949.99, 'https://example.com/images/devices/iphone_15.png'),
((SELECT id FROM manufacturers WHERE name = 'Apple' AND category_id = (SELECT id FROM repair_categories WHERE name = 'Tablets')), 'iPad Pro 12.9"', 1099.99, 1049.99, 'https://example.com/images/devices/ipad_pro_12.png'),
((SELECT id FROM manufacturers WHERE name = 'Dell' AND category_id = (SELECT id FROM repair_categories WHERE name = 'Laptops')), 'XPS 13', 1299.99, 1249.99, 'https://example.com/images/devices/dell_xps_13.png')
ON CONFLICT (manufacturer_id, name) DO NOTHING;

-- Insert sample colors for devices
INSERT INTO device_colors (device_id, name, code) VALUES
((SELECT id FROM devices WHERE name = 'Galaxy S21'), 'Phantom Black', '#000000'),
((SELECT id FROM devices WHERE name = 'Galaxy S21'), 'Phantom White', '#FFFFFF'),
((SELECT id FROM devices WHERE name = 'Galaxy S21'), 'Phantom Violet', '#8A2BE2'),
((SELECT id FROM devices WHERE name = 'iPhone 15'), 'Black', '#000000'),
((SELECT id FROM devices WHERE name = 'iPhone 15'), 'White', '#FFFFFF'),
((SELECT id FROM devices WHERE name = 'iPhone 15'), 'Blue', '#0000FF')
ON CONFLICT (device_id, name) DO NOTHING;

-- Insert sample problems/repairs for devices (using direct IDs to avoid subquery issues)
INSERT INTO device_problems (device_id, name, retail_price, sale_price, image) VALUES
(1, 'Screen Replacement', 299.99, 249.99, 'https://example.com/images/problems/screen_replacement.png'),
(1, 'Battery Replacement', 149.99, 129.99, 'https://example.com/images/problems/battery_replacement.png'),
(1, 'Charging Port Repair', 89.99, 79.99, 'https://example.com/images/problems/charging_port.png'),
(4, 'Screen Replacement', 399.99, 349.99, 'https://example.com/images/problems/screen_replacement.png'),
(4, 'Battery Replacement', 199.99, 179.99, 'https://example.com/images/problems/battery_replacement.png'),
(5, 'Screen Replacement', 499.99, 449.99, 'https://example.com/images/problems/screen_replacement.png'),
(5, 'Keyboard Replacement', 299.99, 269.99, 'https://example.com/images/problems/keyboard_replacement.png')
ON CONFLICT (device_id, name) DO NOTHING;
