import type { WasteSubmissionWithCollector } from '@/types/database';

export const generateWasteSubmissionsCSV = (submissions: WasteSubmissionWithCollector[]): string => {
  if (submissions.length === 0) return '';

  const headers = [
    'Date',
    'Time',
    'Waste Type',
    'Weight (kg)',
    'Colony Name',
    'Building Number',
    'House Number',
    'Collector Name',
    'Employee ID',
    'Vehicle Number',
    'Status',
    'Notes',
    'Submission ID'
  ];

  const rows = submissions.map(submission => [
    new Date(submission.date_time).toLocaleDateString('en-IN'),
    new Date(submission.date_time).toLocaleTimeString('en-IN'),
    submission.waste_type,
    submission.weight.toString(),
    submission.colony_name,
    submission.building_number || '',
    submission.house_number || '',
    submission.garbage_collector_profiles?.personal_name || 'Unknown',
    submission.garbage_collector_profiles?.employee_id || 'N/A',
    submission.garbage_collector_profiles?.vehicle_number || 'N/A',
    submission.status,
    submission.notes || '',
    submission.id
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // Escape cells that contain commas, quotes, or newlines
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

export const generateColonyAnalyticsCSV = (analytics: any[]): string => {
  if (analytics.length === 0) return '';

  const headers = [
    'Date',
    'Colony Name',
    'Waste Type',
    'Total Weight (kg)',
    'Submission Count',
    'Collector Count'
  ];

  const rows = analytics.map(item => [
    new Date(item.date).toLocaleDateString('en-IN'),
    item.colony_name,
    item.waste_type,
    item.total_weight.toString(),
    item.submission_count.toString(),
    item.collector_count.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  // In a real mobile app, you would use a file system library like expo-file-system
  // For now, we'll return the content for further processing
  console.log('CSV Content generated:', filename);
  return csvContent;
};

export const formatDateForFilename = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateFilename = (type: string, startDate: string, endDate: string): string => {
  const start = formatDateForFilename(new Date(startDate));
  const end = formatDateForFilename(new Date(endDate));
  return `${type}_${start}_to_${end}.csv`;
};

export const shareCSV = async (csvContent: string, filename: string) => {
  // In a production app, you would use expo-sharing or similar
  // to allow users to share or save the CSV file
  try {
    // This would be implemented with actual file sharing in production
    console.log('Sharing CSV:', filename);
    return true;
  } catch (error) {
    console.error('Error sharing CSV:', error);
    return false;
  }
};