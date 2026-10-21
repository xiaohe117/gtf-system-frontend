
import { getSize } from '@/utils';
import { getLeadTaskDetail, getClueDetail, getProjectDetail, getMatterDetail } from '@/api/leaderWorkbench';
import ServiceUrl from '@/utils/url'
// 选项
export const entTypeOptions = [
    { label: '企业类型(全部)', value: '' },
    { label: '央企', value: '央企' },
    { label: '外企', value: '外企' },
    { label: '民企', value: '民企' },
];

export const taskTypeOptions = [
    { label: '全部走访', value: '' },
    { label: '牵头任务（已走访+待走访）', value: 'VISITED,PENDING' },
    { label: '已走访', value: 'VISITED' },
    { label: '待走访', value: 'PENDING' },
    { label: '其他企业', value: 'OTHER' },
];

export const followStatusOptions = [
    { label: '跟进状态(全部)', value: '' },
    { label: '已跟进', value: '1' },
    { label: '未跟进', value: '2' },
];

export const agendaStatusOptions = [
    { label: '状态(全部)', value: '' },
    { label: '待推进', value: '1' },
    { label: '推进中', value: '2' },
    { label: '已完成', value: '3' },
];
const goEntDetail = (obj: any) => {
    const params = new URLSearchParams({
        name: obj.companyName || '',
        sccode: obj.enterpriseId || '',
    });
    window.open(`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?${params}`, '_blank');
};
const goClueDetail = (obj: any) => {
    const url = `pc/projectManage/clue/create?pageAction=view&clueId=${obj.clueId}`;
    window.open(`${ServiceUrl.getQmSysUrl()}/${url}`, '_blank');
};

const goProjectDetail = (obj: any) => {
   window.open(
		`${ServiceUrl.getLoginUrl()}/pc/projectManage/create?projectId=${obj.projId}&pageAction=view`,
		'_blank'
	);
}

const goAgreeDetail = (obj: any) => {
    const params = new URLSearchParams({
        id: obj.mid || '',
        resolutionId: obj.matterId || '',
    });
    window.open(`${ServiceUrl.adminUrl}enterprise-form/agendaItems-andIssue-feedback-details?${params}`, '_blank');
}
// 配置
export const config: any = {
    ent: {
        title: '企业明细',
        hasOrder: false,
        columns: [
            {
                prop: 'companyName',
                label: '目标企业名称',
                fixWidth: getSize(150),
                align: 'left',
                type: 'slot',
                slotName: 'companyName',
            },
            {
                prop: 'industrySystem',
                label: '产业体系',
                fixWidth: getSize(109),
                align: 'left',
                type: 'slot',
                slotName: 'text',
            },
            { prop: 'entTags', label: '企业标签', fixWidth: getSize(120), align: 'left', type: 'slot', slotName: 'tags' },
            {
                prop: 'summarize',
                label: '招商线索',
                align: 'left',
                type: 'slot',
                slotName: 'text',
                width: getSize(300),
            },
            {
                prop: 'projDesc',
                label: '招商项目',
                width: getSize(300),
                align: 'left',
                type: 'slot',
                slotName: 'text',
            },
        ],
        searchItems: [
            { placeholder: '请输入企业名称/统一信用代码/注册地址/企业别称', key: 'keyword', type: 'input' },
            {
                placeholder: '企业类型(全部)',
                key: 'entType',
                type: 'select',
                options: entTypeOptions,
            },
            {
                placeholder: '全部走访',
                key: 'taskType',
                type: 'select',
                options: taskTypeOptions,
            },
        ],
        getFunc: getLeadTaskDetail,
        idKey: 'enterpriseId',
        clickDetail: goEntDetail
    },
    clue: {
        title: '招商线索明细',
        hasOrder: false,
        columns: [
            { prop: 'clueName', label: '线索名称', fixWidth: getSize(150), align: 'left', type: 'slot', slotName: 'companyName' },
            { prop: 'companyName', label: '投资方企业名称', fixWidth: getSize(150), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'receivingUnits', label: '跟进单位', fixWidth: getSize(120), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'summarize', label: '线索简介', fixWidth: getSize(220), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'cityIndustrialChainName', label: '产业体系', fixWidth: getSize(109), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'investAmount', label: '预计总投资', fixWidth: getSize(120), align: 'left', type: 'slot', slotName: 'text',unit:'亿元' }
        ],
        searchItems: [
            { placeholder: '请输入线索名称', key: 'keyword', type: 'input' },
        ],
        getFunc: getClueDetail,
        idKey: 'clueId',
        clickDetail: goClueDetail,
    },
    project: {
        title: '招商项目明细',
        hasOrder: false,
        columns: [
            { prop: 'projName', label: '项目名称', fixWidth: getSize(150), align: 'left', type: 'slot', slotName: 'companyName' },
            { prop: 'companyName', label: '主要投资方(企业)名称', fixWidth: getSize(180), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'settleDistrict', label: '落户区', fixWidth: getSize(100), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'projStage', label: '项目阶段', fixWidth: getSize(100), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'industry12218', label: '产业体系', fixWidth: getSize(109), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'estTotalInvest', label: '预计总投资', fixWidth: getSize(120), align: 'left', type: 'slot', slotName: 'text',unit:'亿元' },
            { prop: 'estRevenueAtFull', label: '预计达产年营收/产值', fixWidth: getSize(180), align: 'left', type: 'slot', slotName: 'text',unit:'亿元' },
            { prop: 'projDesc', label: '项目简介', align: 'left', fixWidth: getSize(300), type: 'slot', slotName: 'text' },
            { prop: 'followPlan', label: '项目最新进展', fixWidth: getSize(140), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'createTime', label: '项目最新进展填报时间', fixWidth: getSize(140), align: 'left', type: 'slot', slotName: 'text' },
        ],
        searchItems: [
            { placeholder: '请输入项目名称', key: 'keyword', type: 'input' },
        ],
        getFunc: getProjectDetail,
        idKey: 'projId',
        clickDetail: goProjectDetail,
    },
    agenda: {
        title: '议定事项明细',
        hasOrder: false,
        columns: [
            { prop: 'companyName', label: '关联企业名称', fixWidth: getSize(180), align: 'left', type: 'slot', slotName: 'spanText' },
            { prop: 'matterDescription', label: '议定事项', fixWidth: getSize(300), align: 'left', type: 'slot', slotName: 'companyName' },
            { prop: 'unitName', label: '牵头单位', fixWidth: getSize(180), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'matterStatus', label: '状态', fixWidth: getSize(100), align: 'left', type: 'slot', slotName: 'matterStatus' },
            { prop: 'followStatus', label: '跟进情况', fixWidth: getSize(300), align: 'left', type: 'slot', slotName: 'text' },
            { prop: 'nextPlan', label: '下一步计划', fixWidth: getSize(300), align: 'left', type: 'slot', slotName: 'text' },
        ],
        searchItems: [
            { placeholder: '请输入企业名称/统一信用代码/注册地址/企业别称', key: 'keyword', type: 'input' },
             {
                placeholder: '企业类型(全部)',
                key: 'entType',
                type: 'select',
                options: entTypeOptions,
            },
            {
                placeholder: '状态(全部)',
                key: 'matterStatus',
                type: 'select',
                options: agendaStatusOptions,
            },
        ],
        getFunc:getMatterDetail,
        idKey: 'matterId',
        clickDetail: goAgreeDetail
    },
};

