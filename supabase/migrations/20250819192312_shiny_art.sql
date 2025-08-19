/*
  # Create Database Functions and Triggers

  1. Functions
    - Function to automatically update waste analytics
    - Function to create notifications for new submissions
    - Function to calculate colony statistics

  2. Triggers
    - Trigger to update analytics when waste is submitted
    - Trigger to notify managers of new submissions

  3. Purpose
    - Automate data aggregation for better performance
    - Provide real-time notifications
    - Maintain data consistency
*/

-- Function to update waste analytics
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

-- Create triggers
CREATE TRIGGER trigger_update_waste_analytics
  AFTER INSERT ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_waste_analytics();

CREATE TRIGGER trigger_notify_waste_submission
  AFTER INSERT ON waste_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_waste_submission();