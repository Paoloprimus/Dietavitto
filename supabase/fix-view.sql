-- =============================================
-- QUICK FIX: Materialized View Error
-- =============================================
-- This fixes the "ORDER BY expressions must appear in argument list" error
-- Run this if you got an error with the original schema.sql

-- Drop the view if it exists
DROP MATERIALIZED VIEW IF EXISTS weekly_aggregated;

-- Create the fixed version (without ORDER BY in ARRAY_AGG)
CREATE MATERIALIZED VIEW weekly_aggregated AS
SELECT 
  food_name,
  COUNT(*) as occurrences,
  ARRAY_AGG(DISTINCT day_of_week) as days
FROM daily_foods
GROUP BY food_name
ORDER BY occurrences DESC, food_name ASC;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_weekly_aggregated_food ON weekly_aggregated(food_name);
CREATE INDEX IF NOT EXISTS idx_weekly_aggregated_occurrences ON weekly_aggregated(occurrences);

-- Grant permissions
GRANT SELECT ON TABLE weekly_aggregated TO anon, authenticated;

-- Refresh the view
REFRESH MATERIALIZED VIEW weekly_aggregated;

-- Verify it worked
SELECT * FROM weekly_aggregated LIMIT 5;
