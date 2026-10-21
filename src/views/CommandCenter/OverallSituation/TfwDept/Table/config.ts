import {
	queryTargetFollowCity,
	queryClueTable,
	querySceneTable,
	queryActivityTable,
} from '@/api/commandCenter/deptOverview';
import {
	clueCityColumns,
	clueCityDeptColumns,
	clueCityEntColumns,
	clueCityBnColumns,
	senceCityColumns,
	senceCityDeptColumns,
	senceCityBnColumns,
	senceCityDistrictColumns,
	activityCityColumns,
	activityDeptColumns,
	activityDistrictColumns,
	activityEntColumns,
	activityBnColumns,
	visitCityColumns,
} from './columns';

 const config: Record<string, any> = {
	// 全市引荐有效招商线索情况表 tab
	clueCityColumns: {
		cols: clueCityColumns,
		func: queryClueTable,
		searchParams: { tabType: 'CITY_OVERVIEW' },
	},
	// 市直部门任务完成情况 tab
	clueCityDeptColumns: {
		cols: clueCityDeptColumns,
		func: queryClueTable,
		searchParams: { tabType: 'DEPARTMENT_TASK' },
		suffixTotal: 3,
	},
	// 市属国企任务完成情况 tab
	clueCityEntColumns: {
		cols: clueCityEntColumns,
		func: queryClueTable,
		searchParams: { tabType: 'SOE_TASK' },
		suffixTotal: 3,
	},
	// 办内分局线索统计 tab
	clueCityBnColumns: {
		cols: clueCityBnColumns,
		func: queryClueTable,
		searchParams: { tabType: 'BRANCH_CLUE', merged: true },
		suffixTotal: 1,
	},
	// 全市提供应用场景情况表 tab
	senceCityColumns: {
		cols: senceCityColumns,
		func: querySceneTable,
		searchParams: { tabType: 'CITY_OVERVIEW' },
		notes: [
			 '1.提交场景数：根据"首次提交时间"统计，部门点击提交后的"开放方+能力方场景"数量，即非暂存的场景数量。',
            '2.有效待匹配数：根据"研判通过时间"统计，研判通过的"开放方"场景，经研判筛选为"未匹配有效场景"数量。',
            '3.完成匹配数：根据"匹配完成时间"统计，研判通过的"开放方"场景，已上传佐证材料证明"完成供需匹配的有效场景"数量。',
            '4.有效场景数：根据"研判通过时间"统计，处于有效待匹配阶段和完成匹配阶段的"开放方"场景数量。',
            '5.完成率=有效场景数/全年任务数'
		],
	},
	// 市直部门任务完成情况 tab
	senceCityDeptColumns: {
		cols: senceCityDeptColumns,
		func: querySceneTable,
		searchParams: { tabType: 'DEPARTMENT_TASK',merged: true},
		suffixTotal: 3,
	},
	// 市属国企任务完成情况 tab
	senceCityEntColumns: {
		cols: senceCityDeptColumns,
		func: querySceneTable,
		searchParams: { tabType: 'SOE_TASK',merged: true},
		suffixTotal: 3,
	},
	// 办内分局场景统计 tab
	senceCityBnColumns: {
		cols: senceCityBnColumns,
		func: querySceneTable,
		searchParams: { tabType: 'BRANCH_TASK',merged: true },
		suffixTotal: 1,
	},
	// 各区任务完成情况 tab
	senceCityDistrictColumns: {
		cols: senceCityDistrictColumns,
		func: querySceneTable,
		searchParams: { tabType: 'DISTRICT_TASK',merged: true },
		suffixTotal: 1,
		
	},
	// 全市组织招商专场活动情况表 tab
	activityCityColumns: {
		cols: activityCityColumns,
		func: queryActivityTable,
		searchParams: { tabType: 'CITY_OVERVIEW' },
	},
	// 各部门完成情况 tab
	activityDeptColumns: {
		cols: activityDeptColumns,
		func: queryActivityTable,
		searchParams: { tabType: 'DEPARTMENT_TASK' },
		suffixTotal: 3,
	},
	// 各区完成情况 tab
	activityDistrictColumns: {
		cols: activityDistrictColumns,
		func: queryActivityTable,
		searchParams: { tabType: 'DISTRICT_TASK' },
		suffixTotal: 2,
	},
	// 各国企完成情况 tab
	activityEntColumns: {
		cols: activityEntColumns,
		func: queryActivityTable,
		searchParams: { tabType: 'SOE_TASK' },
		suffixTotal: 3,
	},
	// 办内分局活动统计 tab
	activityBnColumns: {
		cols: activityBnColumns,
		func: queryActivityTable,
		searchParams: { tabType: 'BRANCH_ACTIVITY' },
		suffixTotal: 1,
	},
	// 全市大走访大对接情况表 tab
	visitCityColumns: {
		cols: visitCityColumns,
		func: queryTargetFollowCity,
		searchParams: {},
	},
};
export default config
