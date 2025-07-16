-- Create unavailable_slots table
CREATE TABLE IF NOT EXISTS unavailable_slots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    barber_name TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT,
    is_full_day BOOLEAN DEFAULT FALSE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_unavailable_slots_barber_date ON unavailable_slots(barber_name, date);
CREATE INDEX IF NOT EXISTS idx_unavailable_slots_date ON unavailable_slots(date);

-- Add RLS policies
ALTER TABLE unavailable_slots ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to unavailable slots" ON unavailable_slots
    FOR SELECT TO authenticated
    USING (true);

-- Allow insert/update/delete for authenticated users (barbers can manage their own slots)
CREATE POLICY "Allow full access to unavailable slots" ON unavailable_slots
    FOR ALL TO authenticated
    USING (true);