-- Create geographic tables with nested structure
-- Estados -> Ciudades -> Municipios -> Parroquias -> Sectores -> Napboxes

-- Estados table (States)
CREATE TABLE IF NOT EXISTS estados (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ciudades table (Cities, belongs to Estados)
CREATE TABLE IF NOT EXISTS ciudades (
    id SERIAL PRIMARY KEY,
    estado_id INTEGER NOT NULL REFERENCES estados(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(estado_id, name)
);

-- Municipios table (Municipalities, belongs to Ciudades)
CREATE TABLE IF NOT EXISTS municipios (
    id SERIAL PRIMARY KEY,
    ciudad_id INTEGER NOT NULL REFERENCES ciudades(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ciudad_id, name)
);

-- Parroquias table (Parishes, belongs to Municipios)
CREATE TABLE IF NOT EXISTS parroquias (
    id SERIAL PRIMARY KEY,
    municipio_id INTEGER NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(municipio_id, name)
);

-- Sectores table (Sectors, belongs to Parroquias)
CREATE TABLE IF NOT EXISTS sectores (
    id SERIAL PRIMARY KEY,
    parroquia_id INTEGER NOT NULL REFERENCES parroquias(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parroquia_id, name)
);

-- Napboxes table (belongs to Sectores)
CREATE TABLE IF NOT EXISTS napboxes (
    id SERIAL PRIMARY KEY,
    sector_id INTEGER NOT NULL REFERENCES sectores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    capacity INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(sector_id, name)
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    user_email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ciudades_estado_id ON ciudades(estado_id);
CREATE INDEX IF NOT EXISTS idx_municipios_ciudad_id ON municipios(ciudad_id);
CREATE INDEX IF NOT EXISTS idx_parroquias_municipio_id ON parroquias(municipio_id);
CREATE INDEX IF NOT EXISTS idx_sectores_parroquia_id ON sectores(parroquia_id);
CREATE INDEX IF NOT EXISTS idx_napboxes_sector_id ON napboxes(sector_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Create updated_at triggers
CREATE TRIGGER update_estados_updated_at
    BEFORE UPDATE ON estados
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ciudades_updated_at
    BEFORE UPDATE ON ciudades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_municipios_updated_at
    BEFORE UPDATE ON municipios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parroquias_updated_at
    BEFORE UPDATE ON parroquias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sectores_updated_at
    BEFORE UPDATE ON sectores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_napboxes_updated_at
    BEFORE UPDATE ON napboxes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO estados (name, code) VALUES
('Miranda', 'MI'),
('Caracas', 'CC'),
('Zulia', 'ZU')
ON CONFLICT (name) DO NOTHING;

-- Insert sample ciudades
INSERT INTO ciudades (estado_id, name) VALUES
((SELECT id FROM estados WHERE name = 'Miranda'), 'Chacao'),
((SELECT id FROM estados WHERE name = 'Miranda'), 'Baruta'),
((SELECT id FROM estados WHERE name = 'Caracas'), 'Libertador'),
((SELECT id FROM estados WHERE name = 'Zulia'), 'Maracaibo')
ON CONFLICT (estado_id, name) DO NOTHING;

-- Insert sample municipios
INSERT INTO municipios (ciudad_id, name) VALUES
((SELECT id FROM ciudades WHERE name = 'Chacao'), 'Chacao'),
((SELECT id FROM ciudades WHERE name = 'Baruta'), 'Baruta'),
((SELECT id FROM ciudades WHERE name = 'Libertador'), 'Libertador'),
((SELECT id FROM ciudades WHERE name = 'Maracaibo'), 'Bolívar')
ON CONFLICT (ciudad_id, name) DO NOTHING;

-- Insert sample parroquias
INSERT INTO parroquias (municipio_id, name) VALUES
((SELECT id FROM municipios WHERE name = 'Chacao'), 'Chacao'),
((SELECT id FROM municipios WHERE name = 'Baruta'), 'Baruta'),
((SELECT id FROM municipios WHERE name = 'Libertador'), 'La Pastora'),
((SELECT id FROM municipios WHERE name = 'Bolívar'), 'Bolívar')
ON CONFLICT (municipio_id, name) DO NOTHING;

-- Insert sample sectores
INSERT INTO sectores (parroquia_id, name) VALUES
((SELECT id FROM parroquias WHERE name = 'Chacao'), 'Centro'),
((SELECT id FROM parroquias WHERE name = 'Chacao'), 'Norte'),
((SELECT id FROM parroquias WHERE name = 'Baruta'), 'Las Mercedes'),
((SELECT id FROM parroquias WHERE name = 'La Pastora'), 'La Pastora'),
((SELECT id FROM parroquias WHERE name = 'Bolívar'), 'Centro')
ON CONFLICT (parroquia_id, name) DO NOTHING;

-- Insert sample napboxes
INSERT INTO napboxes (sector_id, name, code, latitude, longitude, capacity, status) VALUES
((SELECT id FROM sectores WHERE name = 'Centro' AND parroquia_id = (SELECT id FROM parroquias WHERE name = 'Chacao')), 'NAP-001', 'NAP001', 10.4969, -66.9036, 100, 'active'),
((SELECT id FROM sectores WHERE name = 'Norte' AND parroquia_id = (SELECT id FROM parroquias WHERE name = 'Chacao')), 'NAP-002', 'NAP002', 10.4975, -66.9040, 150, 'active'),
((SELECT id FROM sectores WHERE name = 'Las Mercedes' AND parroquia_id = (SELECT id FROM parroquias WHERE name = 'Baruta')), 'NAP-003', 'NAP003', 10.4850, -66.8750, 200, 'active'),
((SELECT id FROM sectores WHERE name = 'La Pastora' AND parroquia_id = (SELECT id FROM parroquias WHERE name = 'La Pastora')), 'NAP-004', 'NAP004', 10.5061, -66.9146, 120, 'maintenance'),
((SELECT id FROM sectores WHERE name = 'Centro' AND parroquia_id = (SELECT id FROM parroquias WHERE name = 'Bolívar')), 'NAP-005', 'NAP005', 10.6666, -71.6124, 180, 'active')
ON CONFLICT (sector_id, name) DO NOTHING;
