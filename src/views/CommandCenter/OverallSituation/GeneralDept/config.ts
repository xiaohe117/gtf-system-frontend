/* eslint-disable */
// tab和card 组件配置文件
import { markRaw, defineAsyncComponent } from 'vue';
import ProjectTable from '@/views/CommandCenter/OverallSituation/TfwDept/Table/ProjectTable.vue'
import InfoFinance from './TabsComp/InfoFinance.vue'
import InfoIndustry from './TabsComp/InfoIndustry.vue'
import InfoExpo from './TabsComp/InfoExpo.vue'
import InfoPolicy from './TabsComp/InfoPolicy.vue'
import GeneralTable from './TabsComp/GeneralTable.vue'

const VisitTable = defineAsyncComponent(() => import('@/views/CommandCenter/OverallSituation/TfwDept/Table/VisitTable.vue'))

import {
    clueCityDeptColumns,
    clueCityEntColumns,
    clueCityColumns,
    senceCityDeptColumns,
    senceCityDistrictColumns,
    senceCityColumns,
    activityDeptColumns,
    activityEntColumns,
    activityDistrictColumns,
    activityCityColumns,
    visitCityColumns,
    clueDistrictColumns,
    projAreaColumns,
} from '@/views/CommandCenter/OverallSituation/TfwDept/Table/columns'

import {
    queryTargetFollowCity,
    queryClueTable,
    querySceneTable,
    queryActivityTable,
    queryProjectTable,
} from '@/api/commandCenter/deptOverview';
export const tabsConfig: any = {
    info_industry: {
        name: "产业动态",
        comp: markRaw(InfoIndustry),
    },
    info_finance: {
        name: "融资动态",
        comp: markRaw(InfoFinance),
    },
    info_expo: {
        name: "展会动态",
        comp: markRaw(InfoExpo),
    },
    info_policy: {
        name: "政策动态",
        comp: markRaw(InfoPolicy),
    },
    // ==================== 企业走访 ====================
    visit_city: {
        name: "市直部门任务完成情况",
        comp: markRaw(VisitTable),
        titleTab: 'cityDept' // 兼容已开发完的投发委页面
    },
    visit_area: {
        name: "各区任务完成情况",
        comp: markRaw(VisitTable),
        titleTab: 'district' // 兼容已开发完的投发委页面
    },
    visit_total: {
        name: "全市大走访大对接情况表",
        comp: markRaw(GeneralTable),
        cols: visitCityColumns,
        func: queryTargetFollowCity,
        searchParams: {},
    },
    // ==================== 场景策划 ====================
    scene_city: {
        name: "市直部门完成情况",
        comp: markRaw(GeneralTable),
        cols: senceCityDeptColumns,
        searchParams: { tabType: 'DEPARTMENT_TASK', merged: true },
        func: querySceneTable,
        suffixTotal: 3,
    },
    scene_soe: {
        name: "市属国企任务完成情况",
        comp: markRaw(GeneralTable),
        cols: senceCityDeptColumns,
        searchParams: { tabType: 'SOE_TASK', merged: true },
        func: querySceneTable,
        suffixTotal: 3,
    },
    scene_area: {
        name: "各区任务完成情况",
        comp: markRaw(GeneralTable),
        cols: senceCityDistrictColumns,
        searchParams: { tabType: 'DISTRICT_TASK', merged: true },
        func: querySceneTable,
        suffixTotal: 1,
    },
    scene_total: {
        name: "全市提供应用场景情况表",
        comp: markRaw(GeneralTable),
        cols: senceCityColumns,
        searchParams: { tabType: 'CITY_OVERVIEW' },
        func: querySceneTable,
        notes: [
            '1.提交场景数：根据"首次提交时间"统计，部门点击提交后的"开放方+能力方场景"数量，即非暂存的场景数量。',
            '2.有效待匹配数：根据"研判通过时间"统计，研判通过的"开放方"场景，经研判筛选为"未匹配有效场景"数量。',
            '3.完成匹配数：根据"匹配完成时间"统计，研判通过的"开放方"场景，已上传佐证材料证明"完成供需匹配的有效场景"数量。',
            '4.有效场景数：根据"研判通过时间"统计，处于有效待匹配阶段和完成匹配阶段的"开放方"场景数量。',
            '5.完成率=有效场景数/全年任务数'
        ],
    },
    // ==================== 活动举办 ====================
    act_city: {
        name: "市直部门任务完成情况",
        comp: markRaw(GeneralTable),
        cols: activityDeptColumns,
        searchParams: { tabType: 'DEPARTMENT_TASK' },
        func: queryActivityTable,
        suffixTotal: 3,
    },
    act_soe: {
        name: "市属国企任务完成情况",
        comp: markRaw(GeneralTable),
        cols: activityEntColumns,
        searchParams: { tabType: 'SOE_TASK' },
        func: queryActivityTable,
        suffixTotal: 3,
    },
    act_area: {
        name: "各区任务完成情况",
        comp: markRaw(GeneralTable),
        cols: activityDistrictColumns,
        searchParams: { tabType: 'DISTRICT_TASK' },
        func: queryActivityTable,
        suffixTotal: 2,
    },
    act_total: {
        name: "全市组织招商专场活动情况表",
        comp: markRaw(GeneralTable),
        cols: activityCityColumns,
        searchParams: { tabType: 'CITY_OVERVIEW' },
        func: queryActivityTable,
    },
    // ==================== 线索跟踪 ====================
    clue_city: {
        name: "市直部门任务完成情况",
        comp: markRaw(GeneralTable),
        cols: clueCityDeptColumns,
        searchParams: { tabType: 'DEPARTMENT_TASK' },
        func: queryClueTable,
        suffixTotal: 3,
    },
    clue_soe: {
        name: "市属国企任务完成情况",
        comp: markRaw(GeneralTable),
        cols: clueCityEntColumns,
        searchParams: { tabType: 'SOE_TASK' },
        func: queryClueTable,
        suffixTotal: 3,
    },
    clue_area: {
        name: "各区接收线索情况",
        comp: markRaw(GeneralTable),
        searchParams: { tabType: 'DISTRICT_TASK' },
        func: queryClueTable,
        cols: clueDistrictColumns,
        suffixTotal: 2,
    },
    clue_total: {
        name: "全市引荐有效招商线索情况表",
        comp: markRaw(GeneralTable),
        cols: clueCityColumns,
        searchParams: { tabType: 'CITY_OVERVIEW' },
        func: queryClueTable,
    },
    // ==================== 项目推进 ====================
    proj_city: {
        name: "市直部门线索及六个一批项目统计表"
    },
    proj_area: {
        name: "各区接收线索及项目统计表",
        comp: markRaw(GeneralTable),
        cols: projAreaColumns,
        searchParams: { tabType: 'DISTRICT_STAT' },
        func: queryProjectTable,
    },
    proj_total: {
        name: `全市招商引资项目\u201C六个一批\u201D情况表`,
        comp: markRaw(ProjectTable)
    }
};

export const cardConfig: any = {
    // 情报监测
    info: {
        name: "情报监测",
        items: [
            { label: "本月产业动态数", key: "value", unit: "valueUnit" },
            { label: "本月融资动态数", key: "target", unit: "targetUnit" },
        ],
        hideDate: true,
    },
    // 场景策划
    scene: {
        name: "场景策划",
        items: [
            { label: "累计提供有效应用场景", key: "value", unit: "valueUnit" },
            {
                label: "目标数/完成率",
                key: "sceneTarget",
                type: "progress",
                unit: "targetUnit",
            },
        ],
    },
    // 活动举办
    act: {
        name: "活动举办",
        items: [
            { label: "组织招商推介活动", key: "value", unit: "valueUnit" },
            {
                label: "目标数/完成率",
                key: "activityTarget",
                type: "progress",
            },
        ],
    },
    // 企业走访
    visit: {
        name: "企业走访",
        items: [
            { label: "企业走访总数", key: "value", unit: "valueUnit" },
            {
                label: "目标数/完成率",
                key: "visitTarget",
                type: "progress",
            },
        ],
    },
    // 线索跟踪
    clue: {
        name: "线索跟踪",
        items: [
            { label: "有效线索意向投资额", key: "value", unit: "valueUnit" },
            {
                label: "目标数/完成率",
                key: "clueTarget",
                type: "progress",
            },
        ],
    },
    // 项目推进
    proj: {
        name: "项目推进",
        items: [
            { label: "新签约招商引资额", key: "value", unit: "valueUnit" },
            {
                label: "目标数/完成率",
                key: "projectTarget",
                type: "progress",
            },
        ],
    },
};

export const legendList = [
    { color: '#3F84FF', label: '未更新数据/未考核业务线' },
    { color: '#33B7A0', label: '已达标业务线（考核指标已完成）' },
    { color: '#E6817F', label: '待推进业务线（考核指标未完成）' },
];