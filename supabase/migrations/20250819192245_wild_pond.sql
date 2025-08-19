/*
  # Create Collection Routes Table

  1. New Tables
    - `collection_routes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `collector_id` (uuid, references auth.users)
      - `colonies` (text array, list of colony names)
      - `start_time` (time)
      - `end_time` (time)
      - `days_of_week` (text array, e.g., ['Monday', 'Wednesday', 'Friday'])
      - `route_coordinates` (jsonb, array of lat/lng points)
      - `active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `collection_routes` table
    - Add policies for collectors to read their assigned routes
    - Add policies for managers and authorities to read all routes
    - Add policies for authorities to manage routes

  3. Indexes
    - Index on collector_id for performance
    - Index on active status for filtering
*/

-- Create collection_routes table
CREATE TABLE IF NOT EXISTS collection_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  collector_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  colonies text[] DEFAULT '{}',
  start_time time DEFAULT '06:00:00',
  end_time time DEFAULT '14:00:00',
  days_of_week text[] DEFAULT '{}',
  route_coordinates jsonb DEFAULT '[]',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collection_routes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Collectors can read own routes"
  ON collection_routes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = collector_id);

CREATE POLICY "Managers and authorities can read all routes"
  ON collection_routes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "Authorities can manage routes"
  ON collection_routes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_collection_routes_updated_at
  BEFORE UPDATE ON collection_routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collection_routes_collector_id ON collection_routes(collector_id);
CREATE INDEX IF NOT EXISTS idx_collection_routes_active ON collection_routes(active);