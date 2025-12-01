-- Create US states table for tax forms
CREATE TABLE IF NOT EXISTS us_states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(2) NOT NULL UNIQUE,
    exempt VARCHAR(50) DEFAULT 'Result',
    result VARCHAR(50) DEFAULT 'Reject',
    reject VARCHAR(50) DEFAULT 'View',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_forms table for user submissions
CREATE TABLE IF NOT EXISTS tax_forms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('resale', 'tax-exempt')),
    business_name VARCHAR(255),
    address TEXT,
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(10),
    certificate_url TEXT,
    certificate_path TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_exemptions table for state-level exemptions
CREATE TABLE IF NOT EXISTS tax_exemptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    state_name VARCHAR(255) NOT NULL,
    is_exempt BOOLEAN DEFAULT false,
    certificate_url TEXT,
    certificate_path TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, state_name)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_us_states_name ON us_states(name);
CREATE INDEX IF NOT EXISTS idx_us_states_code ON us_states(code);
CREATE INDEX IF NOT EXISTS idx_tax_forms_user_id ON tax_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_forms_status ON tax_forms(status);
CREATE INDEX IF NOT EXISTS idx_tax_forms_type ON tax_forms(type);
CREATE INDEX IF NOT EXISTS idx_tax_exemptions_user_id ON tax_exemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_exemptions_state ON tax_exemptions(state_name);
CREATE INDEX IF NOT EXISTS idx_tax_exemptions_status ON tax_exemptions(status);

-- Create updated_at triggers
CREATE TRIGGER update_us_states_updated_at
    BEFORE UPDATE ON us_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_forms_updated_at
    BEFORE UPDATE ON tax_forms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_exemptions_updated_at
    BEFORE UPDATE ON tax_exemptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert US states data
INSERT INTO us_states (name, code, exempt, result, reject) VALUES
('Alabama', 'AL', 'Result', 'Reject', 'View'),
('Alaska', 'AK', 'Exempt', 'Exempt', 'View'),
('Arizona', 'AZ', 'Result', 'Reject', 'View'),
('Arkansas', 'AR', 'Result', 'Reject', 'View'),
('California', 'CA', 'Result', 'Reject', 'View'),
('Colorado', 'CO', 'Result', 'Reject', 'View'),
('Connecticut', 'CT', 'Result', 'Reject', 'View'),
('Delaware', 'DE', 'Result', 'Reject', 'View'),
('Florida', 'FL', 'Result', 'Reject', 'View'),
('Georgia', 'GA', 'Result', 'Reject', 'View'),
('Hawaii', 'HI', 'Result', 'Reject', 'View'),
('Idaho', 'ID', 'Result', 'Reject', 'View'),
('Illinois', 'IL', 'Result', 'Reject', 'View'),
('Indiana', 'IN', 'Result', 'Reject', 'View'),
('Iowa', 'IA', 'Result', 'Reject', 'View'),
('Kansas', 'KS', 'Result', 'Reject', 'View'),
('Kentucky', 'KY', 'Result', 'Reject', 'View'),
('Louisiana', 'LA', 'Result', 'Reject', 'View'),
('Maine', 'ME', 'Result', 'Reject', 'View'),
('Maryland', 'MD', 'Result', 'Reject', 'View'),
('Massachusetts', 'MA', 'Result', 'Reject', 'View'),
('Michigan', 'MI', 'Result', 'Reject', 'View'),
('Minnesota', 'MN', 'Result', 'Reject', 'View'),
('Mississippi', 'MS', 'Result', 'Reject', 'View'),
('Missouri', 'MO', 'Result', 'Reject', 'View'),
('Montana', 'MT', 'Result', 'Reject', 'View'),
('Nebraska', 'NE', 'Result', 'Reject', 'View'),
('Nevada', 'NV', 'Result', 'Reject', 'View'),
('New Hampshire', 'NH', 'Result', 'Reject', 'View'),
('New Jersey', 'NJ', 'Result', 'Reject', 'View'),
('New Mexico', 'NM', 'Result', 'Reject', 'View'),
('New York', 'NY', 'Result', 'Reject', 'View'),
('North Carolina', 'NC', 'Result', 'Reject', 'View'),
('North Dakota', 'ND', 'Result', 'Reject', 'View'),
('Ohio', 'OH', 'Result', 'Reject', 'View'),
('Oklahoma', 'OK', 'Result', 'Reject', 'View'),
('Oregon', 'OR', 'Result', 'Reject', 'View'),
('Pennsylvania', 'PA', 'Result', 'Reject', 'View'),
('Rhode Island', 'RI', 'Result', 'Reject', 'View'),
('South Carolina', 'SC', 'Result', 'Reject', 'View'),
('South Dakota', 'SD', 'Result', 'Reject', 'View'),
('Tennessee', 'TN', 'Result', 'Reject', 'View'),
('Texas', 'TX', 'Result', 'Reject', 'View'),
('Utah', 'UT', 'Result', 'Reject', 'View'),
('Vermont', 'VT', 'Result', 'Reject', 'View'),
('Virginia', 'VA', 'Result', 'Reject', 'View'),
('Washington', 'WA', 'Result', 'Reject', 'View'),
('West Virginia', 'WV', 'Result', 'Reject', 'View'),
('Wisconsin', 'WI', 'Result', 'Reject', 'View'),
('Wyoming', 'WY', 'Result', 'Reject', 'View')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE tax_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_exemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tax_forms
CREATE POLICY "Users can view their own tax forms" ON tax_forms
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax forms" ON tax_forms
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax forms" ON tax_forms
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for tax_exemptions
CREATE POLICY "Users can view their own tax exemptions" ON tax_exemptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax exemptions" ON tax_exemptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax exemptions" ON tax_exemptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow admins to view all records
CREATE POLICY "Admins can view all tax forms" ON tax_forms
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all tax exemptions" ON tax_exemptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
