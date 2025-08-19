-- =====================================================
-- WASTE MANAGEMENT APPLICATION DATABASE SETUP
-- =====================================================
-- Execute this entire script in Supabase SQL Editor
-- This will create all tables, policies, and sample data

-- =====================================================
-- 1. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 2. USER PROFILES TABLE
-- =====================================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('garbage_collector', 'colony_manager', 'government_authority')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Government authorities can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. GARBAGE COLLECTOR PROFILES TABLE
-- =====================================================

-- Create garbage_collector_profiles table
CREATE TABLE IF NOT EXISTS garbage_collector_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  employee_id text UNIQUE,
  contact_number text DEFAULT '',
  years_of_experience integer DEFAULT 0,
  complete_address text DEFAULT '',
  assigned_areas text[] DEFAULT '{}',
  shift_timing text DEFAULT '',
  vehicle_number text DEFAULT '',
  supervisor_name text DEFAULT '',
  working_status text DEFAULT 'Active' CHECK (working_status IN ('Active', 'On Leave', 'Retired')),
  daily_task_counter integer DEFAULT 0,
  profile_picture text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE garbage_collector_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for garbage_collector_profiles
CREATE POLICY "Collectors can read own profile"
  ON garbage_collector_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Managers and authorities can read collector profiles"
  ON garbage_collector_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() 
      AND up.role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "Collectors can insert own profile"
  ON garbage_collector_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Collectors can update own profile"
  ON garbage_collector_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger and indexes
CREATE TRIGGER update_garbage_collector_profiles_updated_at
  BEFORE UPDATE ON garbage_collector_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_garbage_collector_profiles_user_id ON garbage_collector_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_garbage_collector_profiles_employee_id ON garbage_collector_profiles(employee_id);
CREATE INDEX IF NOT EXISTS idx_garbage_collector_profiles_vehicle_number ON garbage_collector_profiles(vehicle_number);

-- =====================================================
-- 4. COLONY MANAGER PROFILES TABLE
-- =====================================================

-- Create colony_manager_profiles table
CREATE TABLE IF NOT EXISTS colony_manager_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  contact_number text DEFAULT '',
  email text DEFAULT '',
  colony_name text DEFAULT '',
  colony_address text DEFAULT '',
  ward_number text DEFAULT '',
  zone_number text DEFAULT '',
  president_name text DEFAULT '',
  president_contact text DEFAULT '',
  president_email text DEFAULT '',
  secretary_name text DEFAULT '',
  secretary_contact text DEFAULT '',
  secretary_email text DEFAULT '',
  number_of_buildings integer DEFAULT 0,
  occupied_residential_units integer DEFAULT 0,
  unoccupied_residential_units integer DEFAULT 0,
  offices integer DEFAULT 0,
  shops integer DEFAULT 0,
  eateries integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE colony_manager_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for colony_manager_profiles
CREATE POLICY "Managers can read own profile"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authorities can read all manager profiles"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

CREATE POLICY "Collectors can read manager profiles"
  ON colony_manager_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'garbage_collector'
    )
  );

CREATE POLICY "Managers can insert own profile"
  ON colony_manager_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can update own profile"
  ON colony_manager_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger and indexes
CREATE TRIGGER update_colony_manager_profiles_updated_at
  BEFORE UPDATE ON colony_manager_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_colony_manager_profiles_user_id ON colony_manager_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_colony_manager_profiles_colony_name ON colony_manager_profiles(colony_name);

-- =====================================================
-- 5. GOVERNMENT AUTHORITY PROFILES TABLE
-- =====================================================

-- Create government_authority_profiles table
CREATE TABLE IF NOT EXISTS government_authority_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  personal_name text DEFAULT '',
  contact_number text DEFAULT '',
  email text DEFAULT '',
  department text DEFAULT '',
  position text DEFAULT '',
  jurisdiction text DEFAULT '',
  office_address text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE government_authority_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for government_authority_profiles
CREATE POLICY "Authorities can read own profile"
  ON government_authority_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authorities can read other authority profiles"
  ON government_authority_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

CREATE POLICY "Authorities can insert own profile"
  ON government_authority_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authorities can update own profile"
  ON government_authority_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger and indexes
CREATE TRIGGER update_government_authority_profiles_updated_at
  BEFORE UPDATE ON government_authority_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_government_authority_profiles_user_id ON government_authority_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_government_authority_profiles_department ON government_authority_profiles(department);

-- =====================================================
-- 6. WASTE CATEGORIES TABLE
-- =====================================================

-- Create waste_categories table
CREATE TABLE IF NOT EXISTS waste_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  category_type text DEFAULT 'other' CHECK (category_type IN ('recyclable', 'biodegradable', 'hazardous', 'other')),
  color_code text DEFAULT '#6B7280',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waste_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for waste_categories
CREATE POLICY "All authenticated users can read waste categories"
  ON waste_categories
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Authorities can manage waste categories"
  ON waste_categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

-- Create trigger and indexes
CREATE TRIGGER update_waste_categories_updated_at
  BEFORE UPDATE ON waste_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_waste_categories_name ON waste_categories(name);
CREATE INDEX IF NOT EXISTS idx_waste_categories_category_type ON waste_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_waste_categories_active ON waste_categories(active);

-- Insert waste categories
INSERT INTO waste_categories (name, description, category_type, color_code) VALUES
  ('Paper', 'Newspapers, magazines, office paper', 'recyclable', '#3B82F6'),
  ('Cardboard', 'Cardboard boxes and packaging', 'recyclable', '#3B82F6'),
  ('PET Bottles', 'Plastic bottles with PET marking', 'recyclable', '#10B981'),
  ('Other Plastics', 'Non-PET plastic items', 'recyclable', '#10B981'),
  ('Glass', 'Glass bottles and containers', 'recyclable', '#8B5CF6'),
  ('Metals', 'Aluminum cans, metal containers', 'recyclable', '#6B7280'),
  ('Textiles', 'Clothing, fabric materials', 'other', '#F59E0B'),
  ('Footwear', 'Shoes, sandals, boots', 'other', '#F59E0B'),
  ('E-waste', 'Electronic devices and components', 'hazardous', '#EF4444'),
  ('Hazardous Waste', 'Batteries, chemicals, medical waste', 'hazardous', '#EF4444'),
  ('Sanitary Waste', 'Diapers, sanitary products', 'other', '#EC4899'),
  ('Coconut Shells', 'Hard coconut shells', 'biodegradable', '#22C55E'),
  ('Tender Coconut Shells', 'Soft coconut shells', 'biodegradable', '#22C55E'),
  ('Garden Waste', 'Leaves, branches, grass', 'biodegradable', '#22C55E'),
  ('Other Biodegradable Waste', 'Food scraps, organic matter', 'biodegradable', '#22C55E'),
  ('Other Non-recyclables', 'Mixed waste, non-categorized items', 'other', '#6B7280')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 7. WASTE SUBMISSIONS TABLE
-- =====================================================

-- Create waste_submissions table
CREATE TABLE IF NOT EXISTS waste_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collector_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date_time timestamptz NOT NULL DEFAULT now(),
  waste_type text NOT NULL,
  weight numeric(10,2) NOT NULL CHECK (weight > 0),
  colony_name text NOT NULL,
  building_number text DEFAULT '',
  house_number text DEFAULT '',
  image_url text DEFAULT '',
  notes text DEFAULT '',
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'verified', 'processed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waste_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for waste_submissions
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
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'colony_manager'
    )
  );

CREATE POLICY "Authorities can read all submissions"
  ON waste_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
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

CREATE POLICY "Managers can update submission status"
  ON waste_submissions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role IN ('colony_manager', 'government_authority')
    )
  );

-- Create trigger and indexes
CREATE TRIGGER update_waste_submissions_updated_at
  BEFORE UPDATE ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_waste_submissions_collector_id ON waste_submissions(collector_id);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_date_time ON waste_submissions(date_time);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_colony_name ON waste_submissions(colony_name);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_waste_type ON waste_submissions(waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_submissions_status ON waste_submissions(status);

-- =====================================================
-- 8. VEHICLE TRACKING TABLE
-- =====================================================

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

-- Create policies for vehicle_tracking
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
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'colony_manager'
    )
  );

CREATE POLICY "Authorities can read all vehicle tracking"
  ON vehicle_tracking
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_collector_id ON vehicle_tracking(collector_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_vehicle_number ON vehicle_tracking(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_timestamp ON vehicle_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_vehicle_tracking_status ON vehicle_tracking(status);

-- =====================================================
-- 9. NOTIFICATIONS TABLE
-- =====================================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  action_url text DEFAULT '',
  data jsonb DEFAULT '{}',
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_expires_at ON notifications(expires_at);

-- =====================================================
-- 10. COLONY AREAS TABLE
-- =====================================================

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
  total_units integer DEFAULT 0,
  active boolean DEFAULT true,
  latitude numeric(10,8),
  longitude numeric(11,8),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE colony_areas ENABLE ROW LEVEL SECURITY;

-- Create policies for colony_areas
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
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

CREATE POLICY "Authorities can insert colonies"
  ON colony_areas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

-- Create trigger and indexes
CREATE TRIGGER update_colony_areas_updated_at
  BEFORE UPDATE ON colony_areas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_colony_areas_name ON colony_areas(name);
CREATE INDEX IF NOT EXISTS idx_colony_areas_manager_id ON colony_areas(manager_id);
CREATE INDEX IF NOT EXISTS idx_colony_areas_ward_number ON colony_areas(ward_number);
CREATE INDEX IF NOT EXISTS idx_colony_areas_zone_number ON colony_areas(zone_number);
CREATE INDEX IF NOT EXISTS idx_colony_areas_active ON colony_areas(active);

-- =====================================================
-- 11. COLLECTION ROUTES TABLE
-- =====================================================

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

-- Create policies for collection_routes
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
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "Authorities can manage routes"
  ON collection_routes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role = 'government_authority'
    )
  );

-- Create trigger and indexes
CREATE TRIGGER update_collection_routes_updated_at
  BEFORE UPDATE ON collection_routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_collection_routes_collector_id ON collection_routes(collector_id);
CREATE INDEX IF NOT EXISTS idx_collection_routes_active ON collection_routes(active);

-- =====================================================
-- 12. WASTE ANALYTICS TABLE
-- =====================================================

-- Create waste_analytics table for pre-computed analytics
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

-- Create policies for waste_analytics
CREATE POLICY "Managers and authorities can read analytics"
  ON waste_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid() AND up.role IN ('colony_manager', 'government_authority')
    )
  );

CREATE POLICY "System can manage analytics"
  ON waste_analytics
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger and indexes
CREATE TRIGGER update_waste_analytics_updated_at
  BEFORE UPDATE ON waste_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_waste_analytics_date ON waste_analytics(date);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_colony_name ON waste_analytics(colony_name);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_waste_type ON waste_analytics(waste_type);
CREATE INDEX IF NOT EXISTS idx_waste_analytics_unique ON waste_analytics(date, colony_name, waste_type);

-- =====================================================
-- 13. DATABASE FUNCTIONS
-- =====================================================

-- Function to update waste analytics automatically
CREATE OR REPLACE FUNCTION update_waste_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update analytics for the submission date
  INSERT INTO waste_analytics (date, colony_name, waste_type, total_weight, submission_count, collector_count)
  VALUES (
    DATE(NEW.date_time),
    NEW.colony_name,
    NEW.waste_type,
    NEW.weight,
    1,
    1
  )
  ON CONFLICT (date, colony_name, waste_type)
  DO UPDATE SET
    total_weight = waste_analytics.total_weight + NEW.weight,
    submission_count = waste_analytics.submission_count + 1,
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification for new waste submission
CREATE OR REPLACE FUNCTION notify_waste_submission()
RETURNS TRIGGER AS $$
DECLARE
  manager_user_id uuid;
BEGIN
  -- Find the manager for this colony
  SELECT user_id INTO manager_user_id
  FROM colony_manager_profiles
  WHERE colony_name = NEW.colony_name
  LIMIT 1;

  -- Create notification for the manager if found
  IF manager_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, data)
    VALUES (
      manager_user_id,
      'New Waste Submission',
      'A new waste submission has been recorded for ' || NEW.colony_name,
      'info',
      jsonb_build_object(
        'submission_id', NEW.id,
        'waste_type', NEW.waste_type,
        'weight', NEW.weight,
        'colony_name', NEW.colony_name
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate colony statistics
CREATE OR REPLACE FUNCTION get_colony_stats(colony_name_param text, start_date date DEFAULT NULL, end_date date DEFAULT NULL)
RETURNS TABLE (
  total_weight numeric,
  total_submissions bigint,
  unique_collectors bigint,
  most_common_waste_type text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(ws.weight), 0) as total_weight,
    COUNT(ws.id) as total_submissions,
    COUNT(DISTINCT ws.collector_id) as unique_collectors,
    (
      SELECT ws2.waste_type
      FROM waste_submissions ws2
      WHERE ws2.colony_name = colony_name_param
        AND (start_date IS NULL OR DATE(ws2.date_time) >= start_date)
        AND (end_date IS NULL OR DATE(ws2.date_time) <= end_date)
      GROUP BY ws2.waste_type
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as most_common_waste_type
  FROM waste_submissions ws
  WHERE ws.colony_name = colony_name_param
    AND (start_date IS NULL OR DATE(ws.date_time) >= start_date)
    AND (end_date IS NULL OR DATE(ws.date_time) <= end_date);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 14. CREATE TRIGGERS
-- =====================================================

-- Create triggers for automatic analytics and notifications
CREATE TRIGGER trigger_update_waste_analytics
  AFTER INSERT ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_waste_analytics();

CREATE TRIGGER trigger_notify_waste_submission
  AFTER INSERT ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_waste_submission();

-- =====================================================
-- 15. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample colony areas
INSERT INTO colony_areas (name, address, ward_number, zone_number, total_buildings, total_residents, total_units, latitude, longitude) VALUES
  ('Green Valley Colony', 'Sector 12, New Delhi, 110001', '12', 'North Zone', 15, 450, 180, 28.6139, 77.2090),
  ('Sunrise Apartments', 'Phase 2, Gurgaon, Haryana 122002', '8', 'South Zone', 8, 320, 128, 28.4595, 77.0266),
  ('Palm Grove Society', 'Sector 45, Noida, UP 201303', '45', 'East Zone', 12, 380, 152, 28.5355, 77.3910),
  ('Rose Garden Complex', 'Block C, Faridabad, Haryana 121001', '23', 'West Zone', 20, 600, 240, 28.4089, 77.3178),
  ('Metro Heights', 'Sector 18, Gurgaon, Haryana 122015', '18', 'Central Zone', 25, 750, 300, 28.4921, 77.0869),
  ('Lotus Enclave', 'Sector 62, Noida, UP 201309', '62', 'East Zone', 18, 540, 216, 28.6271, 77.3747),
  ('Golden Towers', 'Dwarka Sector 7, New Delhi 110075', '7', 'West Zone', 22, 660, 264, 28.5921, 77.0460),
  ('Silver Springs', 'Vasant Kunj, New Delhi 110070', '15', 'South Zone', 16, 480, 192, 28.5244, 77.1597)
ON CONFLICT (name) DO NOTHING;

-- Insert sample collection routes
INSERT INTO collection_routes (name, colonies, start_time, end_time, days_of_week) VALUES
  ('North Zone Route A', ARRAY['Green Valley Colony', 'Golden Towers'], '06:00:00', '14:00:00', ARRAY['Monday', 'Wednesday', 'Friday']),
  ('South Zone Route B', ARRAY['Sunrise Apartments', 'Silver Springs'], '06:00:00', '14:00:00', ARRAY['Tuesday', 'Thursday', 'Saturday']),
  ('East Zone Route C', ARRAY['Palm Grove Society', 'Lotus Enclave'], '14:00:00', '22:00:00', ARRAY['Monday', 'Wednesday', 'Friday']),
  ('Central Route D', ARRAY['Metro Heights', 'Rose Garden Complex'], '14:00:00', '22:00:00', ARRAY['Tuesday', 'Thursday', 'Saturday'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================

-- Display completion message
DO $$
BEGIN
  RAISE NOTICE 'Waste Management Database Setup Complete!';
  RAISE NOTICE 'Tables created: user_profiles, garbage_collector_profiles, colony_manager_profiles, government_authority_profiles, waste_submissions, vehicle_tracking, notifications, colony_areas, collection_routes, waste_analytics, waste_categories';
  RAISE NOTICE 'All RLS policies and triggers have been configured.';
  RAISE NOTICE 'Sample data has been inserted for testing.';
END $$;