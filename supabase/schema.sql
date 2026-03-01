-- =============================================
-- DietaVitto Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: daily_foods
-- =============================================
CREATE TABLE IF NOT EXISTS daily_foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica')),
  category TEXT NOT NULL CHECK (category IN ('Colazione', 'Pranzo', 'Cena')),
  food_name TEXT NOT NULL,
  quantity TEXT,
  checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_foods_day ON daily_foods(day_of_week);
CREATE INDEX IF NOT EXISTS idx_daily_foods_category ON daily_foods(category);

-- =============================================
-- Table: user_preferences
-- =============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  notification_frequency TEXT DEFAULT 'daily' CHECK (notification_frequency IN ('daily', 'alternate', 'weekly')),
  notification_time TIME DEFAULT '08:00:00',
  notification_types TEXT[] DEFAULT ARRAY['shopping'],
  custom_message TEXT,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark')),
  locale TEXT DEFAULT 'it' CHECK (locale IN ('it', 'en', 'de')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- =============================================
-- Materialized View: weekly_aggregated
-- =============================================
CREATE MATERIALIZED VIEW IF NOT EXISTS weekly_aggregated AS
SELECT 
  food_name,
  COUNT(*) as occurrences,
  ARRAY_AGG(DISTINCT day_of_week) as days
FROM daily_foods
GROUP BY food_name
ORDER BY occurrences DESC, food_name ASC;

-- Note: If you need days sorted in week order, use this alternative:
-- This version removes DISTINCT to allow ORDER BY:
/*
CREATE MATERIALIZED VIEW weekly_aggregated AS
WITH ordered_days AS (
  SELECT DISTINCT
    food_name,
    day_of_week,
    CASE day_of_week 
      WHEN 'Lunedì' THEN 1
      WHEN 'Martedì' THEN 2
      WHEN 'Mercoledì' THEN 3
      WHEN 'Giovedì' THEN 4
      WHEN 'Venerdì' THEN 5
      WHEN 'Sabato' THEN 6
      WHEN 'Domenica' THEN 7
    END as day_order
  FROM daily_foods
)
SELECT 
  food_name,
  COUNT(*) as occurrences,
  ARRAY_AGG(day_of_week ORDER BY day_order) as days
FROM ordered_days
GROUP BY food_name
ORDER BY occurrences DESC, food_name ASC;
*/

-- Index on materialized view
CREATE INDEX IF NOT EXISTS idx_weekly_aggregated_food ON weekly_aggregated(food_name);
CREATE INDEX IF NOT EXISTS idx_weekly_aggregated_occurrences ON weekly_aggregated(occurrences);

-- =============================================
-- Function: Refresh weekly_aggregated view
-- =============================================
CREATE OR REPLACE FUNCTION refresh_weekly_aggregated()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_aggregated;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to refresh view on data changes
CREATE TRIGGER trigger_refresh_weekly_aggregated
AFTER INSERT OR UPDATE OR DELETE ON daily_foods
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_weekly_aggregated();

-- =============================================
-- Function: Update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_preferences
CREATE TRIGGER trigger_update_user_preferences_timestamp
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Sample Data (Based on Dieta.txt)
-- =============================================

-- Clear existing data
TRUNCATE TABLE daily_foods CASCADE;

-- Lunedì
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Lunedì', 'Colazione', 'Caffè'),
('Lunedì', 'Colazione', 'Latte'),
('Lunedì', 'Colazione', 'Marmellata'),
('Lunedì', 'Colazione', 'Fette biscottate integrale'),
('Lunedì', 'Colazione', 'Noci'),
('Lunedì', 'Pranzo', 'Pere/Mele'),
('Lunedì', 'Pranzo', 'Insalata'),
('Lunedì', 'Pranzo', 'Broccolo'),
('Lunedì', 'Pranzo', 'Erbette'),
('Lunedì', 'Pranzo', 'Pollo'),
('Lunedì', 'Pranzo', 'Cipolla'),
('Lunedì', 'Cena', 'Peperoni rossi'),
('Lunedì', 'Cena', 'Finocchi'),
('Lunedì', 'Cena', 'Pomodori'),
('Lunedì', 'Cena', 'Carote'),
('Lunedì', 'Cena', 'Pane integrale'),
('Lunedì', 'Cena', 'Merluzzo o Platessa');

-- Martedì
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Martedì', 'Colazione', 'Caffè'),
('Martedì', 'Colazione', 'Latte'),
('Martedì', 'Colazione', 'Biscotti integrali'),
('Martedì', 'Colazione', 'Mandorle'),
('Martedì', 'Colazione', 'Nocciole'),
('Martedì', 'Colazione', 'Banane'),
('Martedì', 'Pranzo', 'Indivia belga'),
('Martedì', 'Pranzo', 'Mele'),
('Martedì', 'Pranzo', 'Uova'),
('Martedì', 'Pranzo', 'Noci'),
('Martedì', 'Pranzo', 'Prosciutto cotto magro'),
('Martedì', 'Pranzo', 'Pane integrale'),
('Martedì', 'Cena', 'Petto di pollo'),
('Martedì', 'Cena', 'Carote'),
('Martedì', 'Cena', 'Pomodori'),
('Martedì', 'Cena', 'Lattuga'),
('Martedì', 'Cena', 'Acqua minerale'),
('Martedì', 'Cena', 'Parmigiano');

-- Mercoledì
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Mercoledì', 'Colazione', 'Caffè'),
('Mercoledì', 'Colazione', 'Latte'),
('Mercoledì', 'Colazione', 'Fette biscottate integrali'),
('Mercoledì', 'Colazione', 'Marmellata alla frutta'),
('Mercoledì', 'Colazione', 'Nocciole'),
('Mercoledì', 'Pranzo', 'Tonno'),
('Mercoledì', 'Pranzo', 'Mozzarella light'),
('Mercoledì', 'Pranzo', 'Pomodorini'),
('Mercoledì', 'Pranzo', 'Lattuga'),
('Mercoledì', 'Pranzo', 'Carote'),
('Mercoledì', 'Pranzo', 'Finocchi'),
('Mercoledì', 'Pranzo', 'Indivia belga'),
('Mercoledì', 'Pranzo', 'Pane integrale'),
('Mercoledì', 'Pranzo', 'Pera'),
('Mercoledì', 'Cena', 'Acqua minerale'),
('Mercoledì', 'Cena', 'Salmone'),
('Mercoledì', 'Cena', 'Limone');

-- Giovedì
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Giovedì', 'Colazione', 'Caffè'),
('Giovedì', 'Colazione', 'Latte'),
('Giovedì', 'Colazione', 'Biscotti integrali'),
('Giovedì', 'Colazione', 'Mandorle'),
('Giovedì', 'Colazione', 'Pere'),
('Giovedì', 'Pranzo', 'Ricotta light'),
('Giovedì', 'Pranzo', 'Cus Cus'),
('Giovedì', 'Pranzo', 'Porro'),
('Giovedì', 'Pranzo', 'Carota'),
('Giovedì', 'Pranzo', 'Peperone rosso'),
('Giovedì', 'Pranzo', 'Zucchine'),
('Giovedì', 'Pranzo', 'Peperone giallo'),
('Giovedì', 'Pranzo', 'Curry'),
('Giovedì', 'Cena', 'Pane integrale'),
('Giovedì', 'Cena', 'Prosciutto cotto'),
('Giovedì', 'Cena', 'Lattuga'),
('Giovedì', 'Cena', 'Fagiolini'),
('Giovedì', 'Cena', 'Bistecca di manzo');

-- Venerdì
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Venerdì', 'Colazione', 'Caffè'),
('Venerdì', 'Colazione', 'Latte'),
('Venerdì', 'Colazione', 'Fette biscottate integrali'),
('Venerdì', 'Colazione', 'Marmellata alla frutta'),
('Venerdì', 'Colazione', 'Melone'),
('Venerdì', 'Pranzo', 'Petto di tacchino'),
('Venerdì', 'Pranzo', 'Lattuga'),
('Venerdì', 'Pranzo', 'Parmigiano'),
('Venerdì', 'Pranzo', 'Mele'),
('Venerdì', 'Pranzo', 'Yogurt greco bianco scremato'),
('Venerdì', 'Cena', 'Crescenza light'),
('Venerdì', 'Cena', 'Insalata mista'),
('Venerdì', 'Cena', 'Fagioli'),
('Venerdì', 'Cena', 'Olio'),
('Venerdì', 'Cena', 'Prezzemolo'),
('Venerdì', 'Cena', 'Limone');

-- Sabato
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Sabato', 'Colazione', 'Caffè'),
('Sabato', 'Colazione', 'Latte'),
('Sabato', 'Colazione', 'Biscotti integrali'),
('Sabato', 'Colazione', 'Nocciole'),
('Sabato', 'Colazione', 'Mele'),
('Sabato', 'Pranzo', 'Trota'),
('Sabato', 'Pranzo', 'Valeriana'),
('Sabato', 'Pranzo', 'Scalogno'),
('Sabato', 'Pranzo', 'Yogurt greco bianco scremato'),
('Sabato', 'Pranzo', 'Prezzemolo'),
('Sabato', 'Pranzo', 'Aceto balsamico'),
('Sabato', 'Cena', 'Lattuga');

-- Domenica (using pattern from first days - customize as needed)
INSERT INTO daily_foods (day_of_week, category, food_name) VALUES
('Domenica', 'Colazione', 'Caffè'),
('Domenica', 'Colazione', 'Latte'),
('Domenica', 'Colazione', 'Fette biscottate integrale'),
('Domenica', 'Colazione', 'Marmellata'),
('Domenica', 'Pranzo', 'Pane integrale'),
('Domenica', 'Pranzo', 'Pomodori'),
('Domenica', 'Pranzo', 'Lattuga'),
('Domenica', 'Cena', 'Pesce misto'),
('Domenica', 'Cena', 'Verdure miste');

-- Refresh materialized view
REFRESH MATERIALIZED VIEW weekly_aggregated;

-- =============================================
-- Row Level Security (Optional - for multi-user)
-- =============================================

-- Enable RLS
ALTER TABLE daily_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Public access for demo (adjust for production with auth)
CREATE POLICY "Allow all access to daily_foods" ON daily_foods
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all access to user_preferences" ON user_preferences
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Grants
-- =============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON TABLE daily_foods TO anon, authenticated;
GRANT ALL ON TABLE user_preferences TO anon, authenticated;
GRANT SELECT ON TABLE weekly_aggregated TO anon, authenticated;

-- Grant sequence usage
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
