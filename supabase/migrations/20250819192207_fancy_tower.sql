/*
  # Create Vehicle Tracking Table

  1. New Tables
    - `vehicle_tracking`
      - `id` (uuid, primary key)
      - `vehicle_number` (text)
      - `collector_id` (uuid, references auth.users)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `location_name` (text, human-readable location)
      - `timestamp` (timestamptz)
      - `status` (text, enum: active, inactive, maintenance)
      - `speed` (numeric, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `vehicle_tracking` table
    - Add policies for collectors to manage their own vehicle tracking
    - Add policies for managers and authorities to read all tracking data

  3. Indexes
    - Index on collector_id for performance
    - Index on vehicle_number for vehicle-based queries
    - Index on timestamp for time-based queries
*/

-- Create vehicle_tracking table
CREATE TABLE IF NOT EXISTS vehicle_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_number text NOT NULL,
  collector_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  latitude numeric(10,8) NOT NULL,
  longitude numeric(11,8) NOT NULL,
  location_name text DEFAULT '',
  timestamp timestamptz NOT NULL DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  speed numeric(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vehicle_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Collectors can read own vehicle tracking"
  ON vehicle_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = collector_id);

CREATE POLICY "Managers can read all vehicle tracking"
  ON vehicle_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'colony_manager'
    )
  );

CREATE POLICY "Authorities can read all vehicle tracking"
  ON vehicle_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

CREATE POLICY "Collectors can insert own vehicle tracking"
  ON vehicle_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = collector_id);

CREATE POLICY "Collectors can update own vehicle tracking"
  ON vehicle_tracking
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = collector_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_collector_id ON vehicle_tracking(collector_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_vehicle_number ON vehicle_tracking(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_timestamp ON vehicle_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_status ON vehicle_tracking(status);