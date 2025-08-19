/*
  # Create Waste Submissions Table

  1. New Tables
    - `waste_submissions`
      - `id` (uuid, primary key)
      - `collector_id` (uuid, references auth.users)
      - `date_time` (timestamptz)
      - `waste_type` (text)
      - `weight` (numeric, weight in kg)
      - `colony_name` (text)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `waste_submissions` table
    - Add policies for collectors to manage their own submissions
    - Add policies for managers and authorities to read all submissions
    - Add policies for managers to read submissions from their colonies

  3. Indexes
    - Index on collector_id for performance
    - Index on date_time for date-based queries
    - Index on colony_name for filtering
*/

-- Create waste_submissions table
CREATE TABLE IF NOT EXISTS waste_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date_time timestamptz NOT NULL DEFAULT now(),
  waste_type text NOT NULL,
  weight numeric(10,2) NOT NULL CHECK (weight > 0),
  colony_name text NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waste_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Collectors can read own submissions"
  ON waste_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = collector_id);

CREATE POLICY "Managers can read all submissions"
  ON waste_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'colony_manager'
    )
  );

CREATE POLICY "Authorities can read all submissions"
  ON waste_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid() AND role = 'government_authority'
    )
  );

CREATE POLICY "Collectors can insert own submissions"
  ON waste_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = collector_id);

CREATE POLICY "Collectors can update own submissions"
  ON waste_submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = collector_id);

-- Create updated_at trigger
CREATE TRIGGER update_waste_submissions_updated_at
  BEFORE UPDATE ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waste_submissions_collector_id ON waste_submissions(collector_id);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_date_time ON waste_submissions(date_time);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_colony_name ON waste_submissions(colony_name);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_waste_type ON waste_submissions(waste_type);