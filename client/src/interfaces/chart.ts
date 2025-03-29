//! DATA interface
export interface MonthlyGrowthData {
  name: string; // Format: 'Jan', 'Feb',...
  growth: number;
}

export interface GenderData {
  name: string;
  count: number;
  fill: string;
}
export interface TotalUsersData{
  students: number;
  teachers: number;
}

export interface ApiGrowthResponse {
  month: number; // 1-12
  count: number;
}

//! API interface
export interface ApiGenderResponse {
  total: number;
  genders: Array<{
    gender: 'male' | 'female';
    count: number;
  }>;
}
