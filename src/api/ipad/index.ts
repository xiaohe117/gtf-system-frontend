// /gtf-chart/getHeadquartersConnectionSummary
import { method, http, prefix } from '@/api/http';

export const test = <T>(data: Object = {}) =>
	http<T>(method.POST, `${prefix}/gtf-chart/test`, { data });

export const getHeadquartersConnectionSummary = <T>(params: Object = {}) =>
	http<T>(method.GET, `${prefix}/gtf-chart/getHeadquartersConnectionSummary`, { params });