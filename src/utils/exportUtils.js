/**
 * Helper to export JSON data to CSV and trigger download
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Desired filename (without .csv)
 * @param {Array} headers - Optional array of strings for headers. If not provided, keys of the first object are used.
 */
export const exportToCSV = (data, filename = 'export', headers = null) => {
  if (!data || !data.length) return;

  const keys = headers || Object.keys(data[0]);
  const csvContent = [
    keys.join(','), // Header row
    ...data.map(row => 
      keys.map(key => {
        let val = row[key];
        // Handle nested objects (like company.name)
        if (typeof val === 'object' && val !== null) {
          val = val.name || val.uniqueId || JSON.stringify(val);
        }
        // Escape quotes and commas
        const strVal = String(val || '').replace(/"/g, '""');
        return `"${strVal}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
