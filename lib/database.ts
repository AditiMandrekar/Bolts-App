import { supabase } from './supabase';
import type { 
  GarbageCollectorProfile, 
  ColonyManagerProfile, 
  GovernmentAuthorityProfile,
  WasteSubmission,
  VehicleTracking,
  ColonyArea,
  Notification
} from '@/types/database';

// User Profile Operations
export const createUserProfile = async (userId: string, email: string, role: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      email,
      role,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Garbage Collector Operations
export const createCollectorProfile = async (profile: Partial<GarbageCollectorProfile>) => {
  const { data, error } = await supabase
    .from('garbage_collector_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCollectorProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('garbage_collector_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getAllCollectors = async () => {
  const { data, error } = await supabase
    .from('garbage_collector_profiles')
    .select(`
      *,
      user_profiles!inner(email, role)
    `)
    .order('personal_name');

  if (error) throw error;
  return data;
};

// Colony Manager Operations
export const createManagerProfile = async (profile: Partial<ColonyManagerProfile>) => {
  const { data, error } = await supabase
    .from('colony_manager_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getManagerProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('colony_manager_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const getAllManagers = async () => {
  const { data, error } = await supabase
    .from('colony_manager_profiles')
    .select(`
      *,
      user_profiles!inner(email, role)
    `)
    .order('personal_name');

  if (error) throw error;
  return data;
};

// Government Authority Operations
export const createAuthorityProfile = async (profile: Partial<GovernmentAuthorityProfile>) => {
  const { data, error } = await supabase
    .from('government_authority_profiles')
    .upsert(profile)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getAuthorityProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('government_authority_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Waste Submission Operations
export const createWasteSubmission = async (submission: Partial<WasteSubmission>) => {
  const { data, error } = await supabase
    .from('waste_submissions')
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getWasteSubmissions = async (filters?: {
  collectorId?: string;
  colonyName?: string;
  startDate?: string;
  endDate?: string;
  wasteType?: string;
  limit?: number;
}) => {
  let query = supabase
    .from('waste_submissions')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, employee_id, vehicle_number)
    `)
    .order('created_at', { ascending: false });

  if (filters?.collectorId) {
    query = query.eq('collector_id', filters.collectorId);
  }

  if (filters?.colonyName) {
    query = query.eq('colony_name', filters.colonyName);
  }

  if (filters?.startDate) {
    query = query.gte('date_time', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('date_time', filters.endDate);
  }

  if (filters?.wasteType) {
    query = query.eq('waste_type', filters.wasteType);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const getWasteSubmissionsByColony = async (colonyName: string, startDate?: string, endDate?: string) => {
  let query = supabase
    .from('waste_submissions')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, employee_id)
    `)
    .eq('colony_name', colonyName)
    .order('date_time', { ascending: false });

  if (startDate) {
    query = query.gte('date_time', startDate);
  }

  if (endDate) {
    query = query.lte('date_time', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Vehicle Tracking Operations
export const updateVehicleLocation = async (tracking: Partial<VehicleTracking>) => {
  const { data, error } = await supabase
    .from('vehicle_tracking')
    .insert(tracking)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getLatestVehicleLocations = async () => {
  const { data, error } = await supabase
    .from('vehicle_tracking')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, vehicle_number)
    `)
    .order('timestamp', { ascending: false });

  if (error) throw error;

  // Get only the latest location for each vehicle
  const latestLocations = new Map();
  data?.forEach(location => {
    const vehicleKey = location.vehicle_number;
    if (!latestLocations.has(vehicleKey) || 
        new Date(location.timestamp) > new Date(latestLocations.get(vehicleKey).timestamp)) {
      latestLocations.set(vehicleKey, location);
    }
  });

  return Array.from(latestLocations.values());
};

export const getVehicleTrackingHistory = async (collectorId: string, hours: number = 24) => {
  const startTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('vehicle_tracking')
    .select('*')
    .eq('collector_id', collectorId)
    .gte('timestamp', startTime)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data;
};

// Colony Areas Operations
export const getColonyAreas = async () => {
  const { data, error } = await supabase
    .from('colony_areas')
    .select(`
      *,
      colony_manager_profiles(personal_name, contact_number)
    `)
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data;
};

export const searchColonies = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('colony_areas')
    .select(`
      *,
      colony_manager_profiles(personal_name, contact_number)
    `)
    .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%,ward_number.ilike.%${searchTerm}%`)
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data;
};

// Waste Categories Operations
export const getWasteCategories = async () => {
  const { data, error } = await supabase
    .from('waste_categories')
    .select('*')
    .eq('active', true)
    .order('name');

  if (error) throw error;
  return data;
};

// Notification Operations
export const createNotification = async (notification: Partial<Notification>) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserNotifications = async (userId: string, limit: number = 50) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUnreadNotificationCount = async (userId: string) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count || 0;
};

// Analytics Operations
export const getSystemStats = async () => {
  try {
    // Get total users by role
    const { data: userStats } = await supabase
      .from('user_profiles')
      .select('role');

    // Get total waste submissions
    const { data: wasteStats } = await supabase
      .from('waste_submissions')
      .select('weight, created_at, waste_type');

    // Get active colonies
    const { count: coloniesCount } = await supabase
      .from('colony_areas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    // Get active vehicles
    const { data: vehicleStats } = await supabase
      .from('vehicle_tracking')
      .select('vehicle_number, status, timestamp')
      .order('timestamp', { ascending: false });

    const collectors = userStats?.filter(u => u.role === 'garbage_collector').length || 0;
    const managers = userStats?.filter(u => u.role === 'colony_manager').length || 0;
    const authorities = userStats?.filter(u => u.role === 'government_authority').length || 0;

    const totalWaste = wasteStats?.reduce((sum, item) => sum + Number(item.weight), 0) || 0;
    const totalSubmissions = wasteStats?.length || 0;

    // Calculate time-based submissions
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const todaySubmissions = wasteStats?.filter(
      item => new Date(item.created_at) >= today
    ).length || 0;

    const weeklySubmissions = wasteStats?.filter(
      item => new Date(item.created_at) >= weekAgo
    ).length || 0;

    const monthlySubmissions = wasteStats?.filter(
      item => new Date(item.created_at) >= monthAgo
    ).length || 0;

    // Get unique active vehicles (latest status per vehicle)
    const uniqueVehicles = new Map();
    vehicleStats?.forEach(vehicle => {
      const key = vehicle.vehicle_number;
      if (!uniqueVehicles.has(key) || 
          new Date(vehicle.timestamp) > new Date(uniqueVehicles.get(key).timestamp)) {
        uniqueVehicles.set(key, vehicle);
      }
    });

    const activeVehicles = Array.from(uniqueVehicles.values())
      .filter(v => v.status === 'active').length;

    return {
      totalCollectors: collectors,
      totalManagers: managers,
      totalAuthorities: authorities,
      totalColonies: coloniesCount || 0,
      totalWasteCollected: totalWaste,
      totalSubmissions,
      todaySubmissions,
      weeklySubmissions,
      monthlySubmissions,
      activeVehicles,
      totalVehicles: uniqueVehicles.size,
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};

export const getWasteAnalytics = async (startDate?: string, endDate?: string, colonyName?: string) => {
  let query = supabase
    .from('waste_analytics')
    .select('*')
    .order('date', { ascending: false });

  if (startDate) {
    query = query.gte('date', startDate);
  }

  if (endDate) {
    query = query.lte('date', endDate);
  }

  if (colonyName) {
    query = query.eq('colony_name', colonyName);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Collection Routes Operations
export const getCollectionRoutes = async (collectorId?: string) => {
  let query = supabase
    .from('collection_routes')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, vehicle_number)
    `)
    .eq('active', true)
    .order('name');

  if (collectorId) {
    query = query.eq('collector_id', collectorId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const createCollectionRoute = async (route: any) => {
  const { data, error } = await supabase
    .from('collection_routes')
    .insert(route)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Advanced Analytics
export const getWasteTypeDistribution = async (startDate?: string, endDate?: string) => {
  let query = supabase
    .from('waste_submissions')
    .select('waste_type, weight')
    .order('waste_type');

  if (startDate) {
    query = query.gte('date_time', startDate);
  }

  if (endDate) {
    query = query.lte('date_time', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Aggregate by waste type
  const distribution = data?.reduce((acc, item) => {
    const type = item.waste_type;
    if (!acc[type]) {
      acc[type] = { weight: 0, count: 0 };
    }
    acc[type].weight += Number(item.weight);
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, { weight: number; count: number }>);

  return distribution;
};

export const getColonyPerformance = async (startDate?: string, endDate?: string) => {
  let query = supabase
    .from('waste_submissions')
    .select('colony_name, weight, date_time')
    .order('colony_name');

  if (startDate) {
    query = query.gte('date_time', startDate);
  }

  if (endDate) {
    query = query.lte('date_time', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Aggregate by colony
  const performance = data?.reduce((acc, item) => {
    const colony = item.colony_name;
    if (!acc[colony]) {
      acc[colony] = { 
        totalWeight: 0, 
        submissionCount: 0, 
        lastSubmission: item.date_time 
      };
    }
    acc[colony].totalWeight += Number(item.weight);
    acc[colony].submissionCount += 1;
    
    // Update last submission if this one is more recent
    if (new Date(item.date_time) > new Date(acc[colony].lastSubmission)) {
      acc[colony].lastSubmission = item.date_time;
    }
    
    return acc;
  }, {} as Record<string, { totalWeight: number; submissionCount: number; lastSubmission: string }>);

  return performance;
};