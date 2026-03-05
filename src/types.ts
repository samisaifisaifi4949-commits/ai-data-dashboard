export interface DataColumn {
  name: string;
  type: 'number' | 'string' | 'date' | 'boolean';
  uniqueValues?: number;
}

export interface DataRow {
  [key: string]: any;
}

export interface DashboardConfig {
  id: string;
  name: string;
  charts: ChartConfig[];
  theme: DashboardTheme;
}

export interface ChartConfig {
  id: string;
  type: ChartType;
  title: string;
  xAxis: string;
  yAxis: string;
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max';
  color?: string;
  layout: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
}

export type ChartType = 
  | 'kpi' 
  | 'bar' 
  | 'line' 
  | 'area' 
  | 'pie' 
  | 'donut' 
  | 'scatter' 
  | 'heatmap' 
  | 'map'
  | 'table';

export interface DashboardTheme {
  primary: string;
  secondary: string;
  background: string;
  cardBg: string;
  text: string;
}

export interface AIInsight {
  title: string;
  content: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
}

export interface User {
  id: string;
  name: string;
  color: string;
  socketId?: string;
}

export interface VersionHistory {
  timestamp: string;
  charts: ChartConfig[];
  updatedBy: string;
}
