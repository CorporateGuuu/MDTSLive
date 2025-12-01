-- Migration: 018_create_devices_table
-- Description: Create devices table for device grading scale with buyback information

-- Create devices table for grading scale
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  size TEXT NOT NULL, -- e.g., "8GB", "32GB", "64GB"
  color TEXT NOT NULL,
  condition TEXT NOT NULL, -- e.g., "Grade A", "Grade B", "Grade C"
  lcd TEXT NOT NULL, -- LCD condition
  frame TEXT NOT NULL, -- Frame condition
  buttons TEXT NOT NULL, -- Buttons condition
  price DECIMAL(10, 2) NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT false,
  images TEXT[], -- Array of image URLs
  category TEXT, -- e.g., "iPhone", "Samsung", "Google"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_devices_brand ON public.devices(brand);
CREATE INDEX idx_devices_model ON public.devices(model);
CREATE INDEX idx_devices_condition ON public.devices(condition);
CREATE INDEX idx_devices_in_stock ON public.devices(in_stock);
CREATE INDEX idx_devices_price ON public.devices(price);
CREATE INDEX idx_devices_category ON public.devices(category);

-- Add updated_at trigger
CREATE TRIGGER devices_updated_at
  BEFORE UPDATE ON public.devices
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample data
INSERT INTO public.devices (brand, model, size, color, condition, lcd, frame, buttons, price, in_stock, images, category) VALUES
  ('Apple', 'iPhone 5C', '8GB', 'Blue', 'Grade B', 'OK', 'OK', 'OK', 54.00, true, '{}', 'iPhone'),
  ('Samsung', 'Galaxy S6', '32GB', 'Black', 'Grade A', 'OK', 'OK', 'OK', 75.00, false, '{}', 'Samsung'),
  ('Apple', 'iPhone 6', '16GB', 'Silver', 'Grade C', 'OK', 'OK', 'OK', 45.00, true, '{}', 'iPhone'),
  ('Google', 'Pixel 3', '64GB', 'White', 'Grade A', 'OK', 'OK', 'OK', 85.00, true, '{}', 'Google'),
  ('Samsung', 'Galaxy Note 8', '64GB', 'Blue', 'Grade B', 'OK', 'OK', 'OK', 65.00, true, '{}', 'Samsung'),
  ('Apple', 'iPhone 7', '32GB', 'Gold', 'Grade A', 'OK', 'OK', 'OK', 95.00, true, '{}', 'iPhone'),
  ('Samsung', 'Galaxy S7', '32GB', 'White', 'Grade B', 'OK', 'OK', 'OK', 55.00, true, '{}', 'Samsung'),
  ('Google', 'Pixel 2', '32GB', 'Black', 'Grade C', 'OK', 'OK', 'OK', 35.00, false, '{}', 'Google'),
  ('Apple', 'iPhone 6S', '64GB', 'Space Gray', 'Grade A', 'OK', 'OK', 'OK', 78.00, true, '{}', 'iPhone'),
  ('Samsung', 'Galaxy Note 9', '128GB', 'Purple', 'Grade A', 'OK', 'OK', 'OK', 125.00, true, '{}', 'Samsung');
