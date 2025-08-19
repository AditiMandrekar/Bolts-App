/*
  # Create Colony Areas Table

  1. New Tables
    - `colony_areas`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `address` (text)
      - `ward_number` (text)
      - `zone_number` (text)
      - `manager_id` (uuid, references auth.users, optional)
      - `total_buildings` (integer, default 0)
      - `total_residents` (integer, default 0)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `colony_areas` table
    - Add policies for all authenticated users to read colony areas
    - Add policies for managers to update their assigned colonies
    - Add policies for authorities to manage all colonies

  3. Indexes
    - Index on name for searching
    - Index on manager_id for manager-based queries
    - Index on ward_number and zone_number for location-based queries
*/

-- Create colony_areas table
CREATE TABLE IF NOT EXISTS colony_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  address text DEFAULT '',
  ward_number text DEFAULT '',
  zone_number text DEFAULT '',
  manager_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  total_buildings integer DEFAULT 0,
  total_residents integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE colony_areas ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All authenticated users can read colony areas"
  ON colony_areas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can update assigned colonies"
  ON colony_areas
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = manager_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

CREATE POLICY "Authorities can insert colonies"
  ON colony_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_colony_areas_updated_at
  BEFORE UPDATE ON colony_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_colony_areas_name ON colony_areas(name);
CREATE INDEX IF NOT EXISTS idx_colony_areas_manager_id ON colony_areas(manager_id);
CREATE INDEX IF NOT EXISTS idx_colony_areas_ward_number ON colony_areas(ward_number);
CREATE INDEX IF NOT EXISTS idx_colony_areas_zone_number ON colony_areas(zone_number);
CREATE INDEX IF NOT EXISTS idx_colony_areas_active ON colony_areas(active);