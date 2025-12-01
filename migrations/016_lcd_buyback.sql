-- Create LCD BuyBack table
CREATE TABLE IF NOT EXISTS public.lcd_buyback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_model VARCHAR(100) NOT NULL,
    photos TEXT[], -- Array of photo URLs
    ship_to TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled')),
    requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_on DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lcd_buyback_user_id ON public.lcd_buyback(user_id);
CREATE INDEX IF NOT EXISTS idx_lcd_buyback_status ON public.lcd_buyback(status);
CREATE INDEX IF NOT EXISTS idx_lcd_buyback_request_id ON public.lcd_buyback(request_id);
CREATE INDEX IF NOT EXISTS idx_lcd_buyback_requested_date ON public.lcd_buyback(requested_date);

-- Enable Row Level Security
ALTER TABLE public.lcd_buyback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own buyback requests" ON public.lcd_buyback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own buyback requests" ON public.lcd_buyback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own buyback requests" ON public.lcd_buyback
    FOR UPDATE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lcd_buyback_updated_at
    BEFORE UPDATE ON public.lcd_buyback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
