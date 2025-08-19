import type { WasteSubmissionWithCollector } from '@/types/database';

export const generateWasteSubmissionsCSV = (submissions: WasteSubmissionWithCollector[]): string => {
  if (submissions.length === 0) return '';

  const headers = [
    'Date',
    'Time',
    'Waste Type',
    'Weight (kg)',
    'Colony Name',
    'Collector Name',
    'Employee ID',
    'Submission ID'
  ];

  const rows = submissions.map(submission => [
    new Date(submission.date_time).toLocaleDateString(),
    new Date(submission.date_time).toLocaleTimeString(),
    submission.waste_type,
    submission.weight.toString(),
    submission.colony_name,
    submission.garbage_collector_profiles?.personal_name || 'Unknown',
    submission.garbage_collector_profiles?.employee_id || 'N/A',
    submission.id
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => 
        typeof cell === 'string' && cell.includes(',') 
          ? `"${cell.replace(/"/g, '""')}"` 
          : cell
      ).join(',')
    )
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  // In a real mobile app, you would use a file system library
  // For now, we'll just log the content or show it in an alert
  console.log('CSV Content:', csvContent);
  return csvContent;
};

export const formatDateForFilename = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateFilename = (startDate: string, endDate: string): string => {
  return `waste_submissions_${startDate}_to_${endDate}.csv`;
};