import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataColumn, DataRow } from '../types';

export const parseCSV = (file: File): Promise<{ data: DataRow[], columns: DataColumn[] }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as DataRow[];
        const columns = inferColumns(data);
        resolve({ data, columns });
      },
      error: (error) => reject(error)
    });
  });
};

export const parseExcel = async (file: File): Promise<{ data: DataRow[], columns: DataColumn[] }> => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet) as DataRow[];
  const columns = inferColumns(data);
  return { data, columns };
};

const inferColumns = (data: DataRow[]): DataColumn[] => {
  if (data.length === 0) return [];
  const keys = Object.keys(data[0]);
  return keys.map(key => {
    const values = data.map(row => row[key]).filter(v => v !== null && v !== undefined);
    const firstValue = values[0];
    let type: DataColumn['type'] = 'string';

    if (typeof firstValue === 'number') type = 'number';
    else if (typeof firstValue === 'boolean') type = 'boolean';
    else if (firstValue instanceof Date || !isNaN(Date.parse(firstValue))) type = 'date';

    return {
      name: key,
      type,
      uniqueValues: new Set(values).size
    };
  });
};

export const aggregateData = (data: DataRow[], config: { xAxis: string, yAxis: string, aggregation?: string }) => {
  const { xAxis, yAxis, aggregation = 'sum' } = config;
  
  const groups: { [key: string]: number[] } = {};
  data.forEach(row => {
    const key = String(row[xAxis]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(Number(row[yAxis]) || 0);
  });

  return Object.entries(groups).map(([name, values]) => {
    let value = 0;
    if (aggregation === 'sum') value = values.reduce((a, b) => a + b, 0);
    else if (aggregation === 'avg') value = values.reduce((a, b) => a + b, 0) / values.length;
    else if (aggregation === 'count') value = values.length;
    else if (aggregation === 'min') value = Math.min(...values);
    else if (aggregation === 'max') value = Math.max(...values);

    return { name, value };
  });
};
