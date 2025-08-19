/*
  # Create Waste Analytics Table

  1. New Tables
    - `waste_analytics`
      - `id` (uuid, primary key)
      - `date` (date)
      - `colony_name` (text)
      - `waste_type` (text)
      - `total_weight` (numeric)
      - `submission_count` (integer)
      - `collector_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `waste_analytics` table
    - Add policies for managers and authorities to read analytics
    - Add policies for system to insert/update analytics

  3. Purpose
    - Pre-computed analytics for better performance
    - Daily aggregation of waste data
    - Supports dashboard charts and reports
*/

-- Create waste_analytics table
CREATE TABLE IF NOT EXISTS waste_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  colony_name text NOT NULL,
  waste_type text NOT NULL,
  total_weight numeric(12,2) DEFAULT 0,
  submission_count integer DEFAULT 0,
  collector_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(date, colony_name, waste_type)
);

-- Enable RLS
ALTER TABLE waste_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Managers and authorities can read analytics"
  ON waste_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "System can manage analytics"
  ON waste_analytics
  FOR ALL
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_waste_analytics_updated_at
  BEFORE UPDATE ON waste_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_analytics_date ON waste_analytics(date);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_colony_name ON waste_analytics(colony_name);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_waste_type ON waste_analytics(waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_unique ON waste_analytics(date, colony_name, waste_type);