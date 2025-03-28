export interface MonthlyGrowthData {
  name: string; // Format: 'Jan', 'Feb',...
  growth: number;
}

export interface ApiGrowthResponse {
  month: number; // 1-12
  count: number;
}

export interface GenderData {
  name: string;
  count: number;
  fill: string;
}

export interface ApiGenderResponse {
  total: number;
  genders: Array<{
    gender: 'male' | 'female';
    count: number;
  }>;
}
