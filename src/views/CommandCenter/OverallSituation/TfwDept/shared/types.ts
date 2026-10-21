export interface VisitStatisticsFilters {
  subjectType: string;
  tagIds: string[];
  timeType: string;
  dateRange: [string, string] | [];
  fillUnitScope: string;
  searchBn: string | null;
}
