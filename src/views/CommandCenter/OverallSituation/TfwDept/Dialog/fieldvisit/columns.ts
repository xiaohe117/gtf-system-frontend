/** columnKey → eventDescription 列表头文案 */
const EVENT_DESCRIPTION_LABEL_MAP: Record<string, string> = {
	resolutionQiyeTimes: '企业诉求',
	resolutionTimes: '议定事项',
};

/**
 * 议定事项 / 企业诉求详情列表列配置（对接 getresolutionList 接口字段）
 * @param columnKey resolutionTimes=议定事项，resolutionQiyeTimes=企业诉求
 */
const getTableColumnsResolutionConfig = (columnKey?: string) => {
	const eventDescriptionLabel = EVENT_DESCRIPTION_LABEL_MAP[columnKey || ''] || '议定事项';

	return [
		{ label: '序号', type: 'index', width: '40', fixWidth: 80, align: 'left' },
		{
			label: '企业名称',
			prop: 'companyName',
			width: 200,
			type: 'slot',
			slotName: 'companyName',
			align: 'left',
			headerAlign: 'center',
		},
		{
			label: eventDescriptionLabel,
			prop: 'eventDescription',
			width: 320,
			type: 'slot',
			slotName: 'eventDescription',
			align: 'left',
			headerAlign: 'center',
		},
		{
			label: '预计完成时间',
			prop: 'expectedCompleteDate',
			width: 200,
			type: 'slot',
			slotName: 'expectedCompleteDate',
		},
		{
			label: '主跟责任单位',
			prop: 'unitName',
			width: 200,
			type: 'slot',
			slotName: 'unitName',
		},
		{
			label: '操作',
			type: 'slot',
			slotName: 'action',
			fixed: 'right',
			width: 100,
		},
	];
};

export default getTableColumnsResolutionConfig;
