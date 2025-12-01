-- Create purchase_orders table for inventory management
CREATE TABLE IF NOT EXISTS purchase_orders (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255),
  purchase_order_status VARCHAR(50) DEFAULT 'pending',
  po_order_id VARCHAR(100) UNIQUE,
  supplier VARCHAR(255),
  sku VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10, 2),
  total_amount DECIMAL(10, 2),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  createdd_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(purchase_order_status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_manufacturer ON purchase_orders(manufacturer);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_created_date ON purchase_orders(created_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_order_id ON purchase_orders(po_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_sku ON purchase_orders(sku);

-- Insert sample data for testing
INSERT INTO purchase_orders (
  item_name,
  manufacturer,
  purchase_order_status,
  po_order_id,
  supplier,
  sku,
  quantity,
  unit_price,
  total_amount
) VALUES
(
  'iPhone 15 Pro Screen',
  'Apple',
  'pending',
  'PO-2024-001',
  'TechParts Inc.',
  'IPH15P-SCR-001',
  10,
  250.00,
  2500.00
),
(
  'Samsung S24 Battery',
  'Samsung',
  'approved',
  'PO-2024-002',
  'MobileParts Ltd.',
  'SAM-S24-BAT-001',
  25,
  45.00,
  1125.00
),
(
  'iPad Pro 12.9" Display',
  'Apple',
  'shipped',
  'PO-2024-003',
  'DisplayTech Corp.',
  'IPAD12-DISP-001',
  5,
  350.00,
  1750.00
);
