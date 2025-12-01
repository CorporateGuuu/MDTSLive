-- Create employee_attendance table
CREATE TABLE IF NOT EXISTS employee_attendance (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) ON DELETE CASCADE,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    total_hours DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'present', -- present, absent, late, etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on employee_id and check_in for faster queries
CREATE INDEX IF NOT EXISTS idx_employee_attendance_employee_id ON employee_attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_attendance_check_in ON employee_attendance(check_in);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_employee_attendance_updated_at
    BEFORE UPDATE ON employee_attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
