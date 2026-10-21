import dayjs from 'dayjs';

function formatDate(value: string): string {
	if (!value) return '-';
	return dayjs(value).format('YYYY-MM-DD');
}

const formatMoney = (value: string, unit: string = ''): string => {
	if (!value) return '-';
	const numValue = parseFloat(value);
	return Number.isNaN(numValue) ? value : `${numValue.toLocaleString()} ${unit}`.trim();
};

const formatArray = (value: any): string => {
	if (!value) return '-';
	return Array.isArray(value) ? value.join('、') : value;
};

const formatArea = (value: string): string => formatMoney(value, '公顷');

// 经营名录 riskAbnormal,
// 纳税人状态非正常 riskAbnormalTaxes,
// 行政处罚 riskAdministrativePenalty,
// 破产程序列表 riskBankruptcy,
// 失信黑名单 riskBlacklist,
// 司法案件列表 riskJudicialCase,
// 土地抵押 riskLandMortgage,
// 不良行为 riskMisconduct,
// 欠税公告 riskOwingTaxes,
// 严重违法失信 riskSeverityIllegality,
// 股权出质 riskStockPledge,
// 重大税收违法案件 riskTaxesIllegality,

const riskConfigs: any = {
	riskAbnormal: {
		label: '经营异常',
		fields: {
			entname: {
				label: '企业名称',
				extraClass: 'company',
				formatter: (v: any) => v || '未知企业',
			},
			regno: { label: '注册号' },
			creditcode: { label: '统一社会信用代码' },
			indate: { label: '列入日期', formatter: formatDate },
			outdate: { label: '移出日期', formatter: formatDate },
			inreason: { label: '列入原因', span: 2 },
			outreason: { label: '移出原因', span: 2 },
			inregorg: { label: '列入机关名称' },
			outregorg: { label: '移除机关名称' },
		},
	},
	riskAbnormalTaxes: {
		label: '纳税人状态非正常',
		fields: {
			entname: { label: '纳税人名称', extraClass: 'company' },
			taxRegno: { label: '纳税人识别号' },
			registrationType: { label: '登记注册类型' },
			regDate: { label: '登记时间', formatter: formatDate },
			organization: { label: '批准机关' },
		},
	},
	riskAdministrativePenalty: {
		label: '行政处罚',
		fields: {
			entname: {
				label: '行政相对人名称',
				extraClass: 'company',
				formatter: (v: any) => v || '未知主体',
			},
			creditcode: { label: '统一社会信用代码' },
			regno: { label: '工商注册号' },
			orgcode: { label: '组织机构代码' },
			name: { label: '法定代表人' },
			address: { label: '注册地址', span: 2 },
			caseName: { label: '案件名称', span: 2 },
			casecode: { label: '处罚决定书文号' },
			punishType: { label: '处罚类别' },
			punishStatus: { label: '处罚状态' },
			provinceName: { label: '省份' },
			areaName: { label: '区域名称' },
			illegalType: { label: '违法行为类型', span: 2 },
			illegalFact: { label: '违法事实', span: 2 },
			punishDepend: { label: '处罚依据', span: 2 },
			punishContent: { label: '处罚内容', span: 2 },
			punishResult: { label: '处罚结果', span: 2 },
			punishDate: { label: '处罚日期', formatter: formatDate },
			endDate: { label: '处罚截止期', formatter: formatDate },
			punishAmonut: { label: '处罚金额', formatter: formatMoney },
			revoverAmount: {
				label: '没收违法所得金额',
				formatter: formatMoney,
			},
			forfeitureAmount: {
				label: '罚没金额',
				formatter: formatMoney,
			},
			licenceNo: { label: '暂扣/吊销证照', span: 2 },
			punishOrg: { label: '处罚机关' },
			orgCreditcode: { label: '处罚机关信用代码' },
			publishDate: { label: '公示日期', formatter: formatDate },
			sourceUnit: { label: '数据来源单位' },
			websiteUrl: {
				label: '官网链接',
				formatter: (v: any) => (v ? '查看链接' : '-'),
				extraClass: 'link',
			},
		},
	},
	riskBankruptcy: {
		label: '破产程序',
		fields: {
			casecode: { label: '案号' },
			caseType: { label: '案件类型' },
			courtName: { label: '法院名称', span: 2 },
			leaderOfManager: { label: '管理人负责人' },
			managerOrg: { label: '管理人机构', span: 2 },
			publishDate: { label: '公示日期', formatter: formatDate },
			litigant: {
				label: '当事人',
				span: 2,
				formatter: (v: any) => (Array.isArray(v) ? v.join('、') : v),
			},
		},
	},
	riskBlacklist: {
		label: '失信黑名单',
		fields: {
			entname: {
				label: '企业名称',
				extraClass: 'company warning',
				formatter: (v: any) => v || '未知主体',
			},
			creditcode: { label: '统一社会信用代码' },
			regno: { label: '工商注册号' },
			title: { label: '黑名单标题', span: 2 },
			blacklistType: { label: '黑名单类型' },
			casecode: { label: '处罚决定文书号' },
			inreason: {
				label: '失信行为',
				span: 2,
				formatter: (v: any) => v || '未公示具体失信行为',
			},
			punishReason: { label: '列入依据', span: 2 },
			inregorg: { label: '列入机关' },
			executeAmount: {
				label: '涉及金额',
				formatter: formatMoney,
			},
			punishResult: { label: '处罚结果', span: 2 },
			indate: { label: '列入日期', formatter: formatDate },
			outdate: { label: '移出日期', formatter: formatDate },
			outreason: { label: '退出原因' },
			publishDate: { label: '公布日期', formatter: formatDate },
			sourceName: { label: '数据来源' },
			sourceUrl: {
				label: '来源网址',
				formatter: (v: any) => (v ? '查看链接' : '-'),
				extraClass: 'link',
			},
			keyworker: { label: '主要负责人' },
			province: { label: '省份' },
		},
	},
	riskJudicialCase: {
		label: '司法案件',
		fields: {
			caseTitle: {
				label: '案件标题',
				span: 2,
				extraClass: 'case-title',
			},
			casecode: { label: '案号' },
			relatedCasecode: { label: '关联案号' },
			caseReason: {
				label: '案由',
				span: 2,
				formatter: (v: any) => v || '未公示具体案由',
			},
			docType: { label: '文书类型' },
			caseType: { label: '案件类型' },
			latestProgress: {
				label: '最新进展',
				span: 2,
				formatter: (v: any) => v || '无进展信息',
			},
			latestProgressDate: {
				label: '进展日期',
				formatter: formatDate,
			},
			litigant: {
				label: '当事人',
				span: 2,
				formatter: formatArray,
			},
			court: {
				label: '审理法院',
				span: 2,
				formatter: formatArray,
			},
		},
	},
	riskLandMortgage: {
		label: '土地抵押',
		fields: {
			parcelNo: { label: '宗地编号' },
			parcelLocated: {
				label: '宗地坐落',
				span: 2,
				extraClass: 'location',
			},
			landMortgagorName: {
				label: '抵押人名称',
				extraClass: 'company',
			},
			landMortgagee: {
				label: '抵押权人',
				extraClass: 'company',
			},
			mortgageLandUse: { label: '土地用途' },
			mortgageLandType: {
				label: '土地权属类型',
				span: 2,
			},
			landarea: {
				label: '土地面积',
				formatter: formatArea,
			},
			mortgageArea: {
				label: '抵押面积',
				formatter: formatArea,
			},
			assessMoney: {
				label: '评估金额',
				formatter: (v: any) => formatMoney(v, '万元'),
			},
			pawnAmount: {
				label: '抵押金额',
				formatter: (v: any) => formatMoney(v, '万元'),
			},
			startDate: {
				label: '抵押起始日',
				formatter: formatDate,
			},
			endDate: {
				label: '抵押截止日',
				formatter: formatDate,
			},
			punishDate: {
				label: '公示日期',
				formatter: formatDate,
			},
			district: { label: '所在行政区' },
			landUseNo: { label: '土地使用权证号' },
		},
	},
	riskMisconduct: {
		label: '不良行为',
		fields: {
			entname: {
				label: '企业名称',
				extraClass: 'company warning',
			},
			creditcode: { label: '统一社会信用代码' },
			blacklistType: { label: '不良行为类型' },
			title: {
				label: '名单标题',
				span: 2,
			},
			casecode: { label: '文书编号' },
			executeContent: {
				label: '处罚内容',
				span: 2,
				formatter: (v: any) => v || '无具体处罚内容',
			},
			executeIssues: {
				label: '处罚事由',
				span: 2,
				formatter: (v: any) => v || '未公示具体事由',
			},
			organization: { label: '实施机构' },
			indate: {
				label: '列入日期',
				formatter: formatDate,
			},
			outdate: {
				label: '移出日期',
				formatter: formatDate,
			},
			outreason: { label: '移出原因' },
			remark: {
				label: '备注',
				span: 2,
				formatter: (v: any) => v || '无备注信息',
			},
		},
	},
	riskOwingTaxes: {
		label: '欠税公告',
		fields: {
			entname: {
				label: '纳税人名称',
				extraClass: 'company warning',
			},
			taxRegno: { label: '纳税人识别号' },
			name: { label: '法定代表人' },
			taxArrears: { label: '欠税人类型' },
			taxCategory: {
				label: '欠税税种',
				span: 2,
			},
			balance: {
				label: '欠税余额',
				formatter: (v: any) => formatMoney(v, '元'),
			},
			balanceNew: {
				label: '新欠税金额',
				formatter: (v: any) => formatMoney(v, '元'),
			},
			payLimitDate: {
				label: '限缴日期',
				formatter: formatDate,
			},
			competentTaxAuthority: {
				label: '主管税务机关',
				span: 2,
			},
			noticeDate: {
				label: '公告日期',
				formatter: formatDate,
			},
			province: { label: '所在省份' },
			businessLocation: {
				label: '经营地点',
				span: 2,
			},
		},
	},
	riskSeverityIllegality: {
		label: '严重违法失信',
		fields: {
			inreason: {
				label: '列入原因',
				span: 2,
				formatter: (v: any) => v || '未公示具体原因',
			},
			outreason: {
				label: '移出原因',
				span: 2,
			},
			inregorg: { label: '列入机关' },
			outregorg: { label: '移出机关' },
			indate: {
				label: '列入日期',
				formatter: formatDate,
			},
			outdate: {
				label: '移出日期',
				formatter: formatDate,
			},
		},
	},
	riskStockPledge: {
		label: '股权出质',
		fields: {
			entname: {
				label: '标的企业',
				extraClass: 'company',
			},
			stkPawnCzper: {
				label: '出质人',
				extraClass: 'person',
			},
			stkPawnZqper: {
				label: '质权人',
				extraClass: 'person',
			},

			stkPawnCzamt: {
				label: '出质股权数额',
				formatter: (v: any) => formatMoney(v, '股'),
			},
			stkPawnRegdate: {
				label: '登记日期',
				formatter: formatDate,
			},
			stkPawnDate: {
				label: '公示日期',
				formatter: formatDate,
			},
			stkPawnStatus: { label: '当前状态' },
			stkPawnRegno: { label: '登记编号' },
			stkPawnAlt: {
				label: '变更信息',
				span: 2,
				formatter: formatArray,
			},
			stkPawnRev: {
				label: '注销信息',
				span: 2,
				formatter: formatArray,
			},
		},
	},
	riskTaxesIllegality: {
		label: '重大税收违法',
		fields: {
			entname: {
				label: '纳税人名称',
				extraClass: 'company danger',
			},
			taxRegno: { label: '纳税人识别号' },
			caseType: {
				label: '案件性质',
				span: 2,
			},
			brkDetail: {
				label: '违法事实',
				span: 2,
				formatter: (v: any) => v || '未公示具体违法事实',
			},
			punishDetail: {
				label: '处罚情况',
				span: 2,
				formatter: (v: any) => v || '未公示处罚详情',
			},
			taxOrgTypename: { label: '税务局类型' },
			taxOrg: { label: '公布机关' },
			evalDate: {
				label: '公布日期',
				formatter: formatDate,
			},
			province: { label: '所在省份' },
			legDetail: {
				label: '法人信息',
				span: 2,
			},
			finaDetail: {
				label: '财务负责人',
				span: 2,
			},
		},
	},
};

export default riskConfigs;
