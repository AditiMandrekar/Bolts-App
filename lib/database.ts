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
}) => {
  let query = supabase
    .from('waste_submissions')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, employee_id)
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

export const getVehicleTracking = async (collectorId?: string) => {
  let query = supabase
    .from('vehicle_tracking')
    .select(`
      *,
      garbage_collector_profiles!inner(personal_name, vehicle_number)
    `)
    .order('timestamp', { ascending: false });

  if (collectorId) {
    query = query.eq('collector_id', collectorId);
  }

  const { data, error } = await query;

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
    .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
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

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

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
      .select('weight, created_at');

    // Get active colonies
    const { count: coloniesCount } = await supabase
      .from('colony_areas')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);

    const collectors = userStats?.filter(u => u.role === 'garbage_collector').length || 0;
    const managers = userStats?.filter(u => u.role === 'colony_manager').length || 0;
    const authorities = userStats?.filter(u => u.role === 'government_authority').length || 0;

    const totalWaste = wasteStats?.reduce((sum, item) => sum + item.weight, 0) || 0;
    const totalSubmissions = wasteStats?.length || 0;

    // Calculate weekly and monthly submissions
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const weeklySubmissions = wasteStats?.filter(
      item => new Date(item.created_at) >= weekAgo
    ).length || 0;

    const monthlySubmissions = wasteStats?.filter(
      item => new Date(item.created_at) >= monthAgo
    ).length || 0;

    return {
      totalCollectors: collectors,
      totalManagers: managers,
      totalAuthorities: authorities,
      totalColonies: coloniesCount || 0,
      totalWasteCollected: totalWaste,
      totalSubmissions,
      weeklySubmissions,
      monthlySubmissions,
    };
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
};