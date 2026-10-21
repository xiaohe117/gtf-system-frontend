export const trafficLightRules = [
	{
		color: '#DF5953',
		colorName: '红灯:',
		description: '实际值 < 预期值目标的90%, 亮红灯',
	},
	{
		color: '#F5CA45',
		colorName: '黄灯:',
		description: '预期目标90% ≤ 实际值 < 预期目标, 亮黄灯',
	},
	{
		color: '#53A064',
		colorName: '绿灯:',
		description: '实际值 ≥ 预期目标, 亮绿灯',
	},
	{
		color: '#4E5969',
		colorName: '灰灯:',
		description: '暂无实际增速或目标增速数据，亮灰灯',
	},
];
export const AppealTipsRules=[
	{ colorName: '红灯:', description: '状态为“久拖未解决”的问题', color: '#df5953' },
	{ colorName: '黄灯:', description: '状态为“解决中”的问题', color: '#ffb10d' },
	{ colorName: '绿灯:', description: '状态为“已解决”的问题', color: '#53a064' },
]
export const WarningTipsRules=[
	{ colorName: '红灯:', description: '经营状况预警', color: '#df5953' },
	{ colorName: '黄灯:', description: '异动预警、舆情预警', color: '#ffb10d' },
	{ colorName: '绿灯:', description: '企业信息监控预警', color: '#53a064' },
]
export const lightTipsRules=[
	{ colorName: '红灯:', description: '实际值 <预期值目标的90%, 亮红灯', color: '#df5953' },
	{ colorName: '黄灯:', description: '预期目标90% ≤实际值< 预期目标,亮黄灯', color: '#ffb10d' },
	{ colorName: '绿灯:', description: '实际值 >预期目标,亮绿灯', color: '#53a064' },
	{ colorName: '灰灯:', description: '暂无实际增速或目标增速数据，亮灰灯', color: '#4e5969' },
]

export const departLightRules = [
	{
		color: '#DF5953',
		colorName: '红灯:',
		description: '考核亮灯指标中有指标亮红灯，则该部门亮红灯。',
	},
	{
		color: '#F5CA45',
		colorName: '黄灯:',
		description: '考核亮灯指标中无指标亮红灯，但有指标亮黄灯，则该部门亮黄灯。',
	},
	{
		color: '#53A064',
		colorName: '绿灯:',
		description: '考核亮灯中无指标亮红灯、黄灯，但有指标亮绿灯，则该部门亮绿灯。',
	},
	{
		color: '#4E5969',
		colorName: '灰灯:',
		description: '考核亮灯指标全部暂无实际增速或目标增速数据，则该部门亮灰灯。',
	},
];

export const specialLightRules = [
	{
		color: '#DF5953',
		colorName: '红灯:',
		description: '考核亮灯指标中有指标亮红灯，则该专班亮红灯。',
	},
	{
		color: '#F5CA45',
		colorName: '黄灯:',
		description: '考核亮灯指标中无指标亮红灯，但有指标亮黄灯，则该专班亮黄灯。',
	},
	{
		color: '#53A064',
		colorName: '绿灯:',
		description: '考核亮灯中无指标亮红灯、黄灯，但有指标亮绿灯，则该专班亮绿灯。',
	},
	{
		color: '#4E5969',
		colorName: '灰灯:',
		description: '考核亮灯指标全部暂无实际增速或目标增速数据，则该专班亮灰灯。',
	},
];

export const streetLightRules = [
	{
		color: '#DF5953',
		colorName: '红灯:',
		description: '考核亮灯指标中有指标亮红灯，则该镇街亮红灯。',
	},
	{
		color: '#F5CA45',
		colorName: '黄灯:',
		description: '考核亮灯指标中无指标亮红灯，但有指标亮黄灯，则该镇街亮黄灯。',
	},
	{
		color: '#53A064',
		colorName: '绿灯:',
		description: '考核亮灯中无指标亮红灯、黄灯，但有指标亮绿灯，则该镇街亮绿灯。',
	},
	{
		color: '#4E5969',
		colorName: '灰灯:',
		description: '考核亮灯指标全部暂无实际增速或目标增速数据，则该镇街亮灰灯。',
	},
];
