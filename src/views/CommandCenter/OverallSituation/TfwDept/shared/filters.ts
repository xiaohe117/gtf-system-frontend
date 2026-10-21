import type { VisitStatisticsFilters } from './types';

export const DEFAULT_VISIT_FILTERS: VisitStatisticsFilters = {
  subjectType: 'enterprise',
  tagIds: [],
  timeType: 'dock',
  dateRange: [],
  fillUnitScope: 'cityDept',
  searchBn: null,
};

export const normalizeTagIdsForSubjectType = (_subjectType: string, tagIds: string[]): string[] => tagIds;
