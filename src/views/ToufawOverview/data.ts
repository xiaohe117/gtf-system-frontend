/*
 * @Descripttion:
 * @Author: ycyun
 * @Date: 2025-06-21 17:55:30
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-07 16:45:37
 */

import { getSize, formatNumber } from '@/utils';
import * as XLSX from 'xlsx';
import axios from 'axios';

export const getBarOption = (val: number) => {
	let data = [
		{ name: '注册', data: [0, 46, 17, 45, 14], color: '#FFB637' },
		{ name: '在谈', data: [1, 132, 16, 82, 19], color: '#FE793B' },
		{ name: '落地', data: [0, 14, 13, 8, 5], color: '#51E1C4' },
		{ name: '签约', data: [0, 5, 8, 5, 3], color: '#408FFF' },
		{ name: '投产（开票）', data: [0, 3, 0, 5, 1], color: '#1EB092' },
		{ name: '开工', data: [0, 0, 1, 1, 0], color: '#37D9FE' },
	];
	let xdata = ['联络活动专班', '未来产业分局', '现代服务业分局', '新兴产业分局', '重点产业分局'];
	let text = '项目数/个'
	if (val === 1) {
		data = [{ name: '目标企业', data: [172, 136, 106, 63], color: '#FFB637' }];
		xdata = ['现代服务业分局', '重点产业分局', '新兴产业分局', '未来产业分局'];
		text = '企业数/个'
	}

	const series = data.map((item) => ({
		type: 'bar',
		...item,
		barWidth: getSize(16),
		itemStyle: {
			normal: {
				color: item.color,
			},
		},
	}));

	const option = {
		grid: {
			top: '10%',
			left: '1%',
			right: '1%',
			bottom: getSize(20),
			containLabel: true,
		},
		tooltip: {
			extraCssText: 'z-index:2',
			trigger: 'axis',
			padding: [getSize(8), getSize(10)],
			backgroundColor: 'rgba(255, 255, 255, 0.9)',
			borderColor: '#ccc',
			formatter: (params: any) => {
				const { name } = params[0];
				let htmlContent = ` <div  style="font-weight: 500;font-size: 0.16rem;line-height:0.16rem;color: rgba(0,0,0,0.65);">${name}</div>`;
				if (Array.isArray(params)) {
					params.forEach((item) => {
						const { color, seriesName, value } = item;
						htmlContent += `
                        <p  class=" fx-al-c fx-r" style="line-height:0.22rem;margin-top:0.08rem;font-size:0.18rem;color: rgba(0,0,0,0.65);font-weight: 300;">
                            <span style="display: inline-block;background:${color};width:0.14rem;height:0.06rem;border-radius:0.02rem;margin-right:0.08rem;"></span>
                            <span class="label" style="margin-right:0.08rem" >${seriesName}</span>
                            <span class="value" >${formatNumber(value)}个</span>
                        </p>
                        `;
					});
				}

				return htmlContent;
			},
		},
		legend: {
			top: '0',
			right: '0%',
			itemWidth: getSize(14),
			itemHeight: getSize(6),
			orient: 'horizontal',
			icon: 'rect',
			textStyle: {
				padding: [0, 0, 0, 0],
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
			},
		},
		xAxis: {
			type: 'category',
			data: xdata,
			axisPointer: {
				type: 'shadow',
			},
			axisLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.1)',
					width: getSize(1),
				},
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				show: true,
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
				interval:0,
			},
		},
		dataZoom:[
			{
				type: 'slider',
				orient: 'horizontal',
				show: xdata.length > 4,
				top: '95%',
				height: getSize(2),
				startValue: 0,
				endValue:3,
				showDetail: false,
				fillerColor: 'rgba(255, 255, 255, 0.5)',
				zoomLock: true, // 👈 用户不能拉伸/压缩滑块，只能拖动
			},
		],
		title: {
			show: true,
			text,
			fontFamily: 'PingFangSC',
			textStyle: {
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.6)',
			},
			top: 0,
			left: '0%',
		},
		yAxis: {
			type: 'value',
			axisTick: {
				show: false,
			},
			axisLine: {
				show: false,
			},

			axisLabel: {
				show: true,
				fontWeight: 400,
				fontSize: getSize(18),
				color: 'rgba(0,0,0,0.65)',
				fontFamily: 'PingFangSC',
			},
			splitLine: {
				show: true,
				lineStyle: {
					color: 'rgba(0,0,0,0.3)',
					width: getSize(1),
				},
			},
			splitNumber: 5,
		},
		series,
	};
	return option;
};
export const fakePlanData = [
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '1',
		tags: [{ name: '中国500强', type: 'warning' }],
	},
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '2',
		tags: [
			{ name: '央企', type: 'warning' },
			{ name: '专精特性', type: 'warning' },
		],
	},
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '3',
		tags: [{ name: '独角兽', type: 'warning' }],
	},
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '4',
		tags: [
			{ name: '央企', type: 'warning' },
			{ name: '专精特性', type: 'warning' },
		],
	},
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '5',
		tags: [{ name: '独角兽', type: 'warning' }],
	},
	{
		companyName: '企业名称',
		direct: '新能源方向描述新能源方向描述',
		index: '6',
		tags: [{ name: '中国500强', type: 'warning' }],
	},
];

export const planColumns = [
	{
		prop: 'tableIndex',
		label: '序号',
		width: getSize(75),
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '企业名称',
		type: 'custom',
		align: 'left',
	},
	{
		prop: 'direct',
		label: '招商方向',
		width: getSize(220),
		align: 'left',
	},
];
export const companyColumns = [
	{
		prop: 'tableIndex',
		label: '序号',
		width: getSize(60),
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '企业名称',
		type: 'custom',
		width: getSize(280),
		align: 'left',
	},
	{
		prop: 'direct',
		label: '招商方向',
		align: 'left',
	},
	{
		prop: 'btn',
		label: '操作',
		align: 'left',
		type: 'slot',
		slotName: 'btn',
		width: getSize(120),
	},
];
export const fakeProjectData = [
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
	{ name: '项目名称项目名称' },
];

export const fakeWallData = [
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
	{
		companyName: '中国电子信息产业集团有限公司',
		ind: '电子信息',
		buz: '集成电路设计与制作',
		direct: '高端芯片研发与生产',
		pro: '目标进展',
		mian: '土地指标紧张，政策支持力度需进一步明确',
		next: '协调相关部门解决土地问题，争取更多政策优',
	},
];

export const wallColumns = [
	{
		prop: 'index',
		label: '序号',
		width: getSize(80),
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '企业名称',
		width: getSize(200),
		align: 'left',
		type: 'slot',
		slotName: 'companyName',
		showToolTip: false,
	},
	{
		prop: '行业',
		label: '行业',
		align: 'left',
		showToolTip: false,
		width: getSize(120),
	},
	{
		prop: 'buz',
		label: '在谈业务',
		align: 'left',
		showToolTip: false,
		width: getSize(120),
	},
	{
		prop: '招商方向',
		label: '招商方向',
		align: 'left',
		showToolTip: false,
	},
	{
		prop: '目标进展',
		label: '目标进展',
		align: 'left',
		showToolTip: false,
	},
	{
		prop: '主要问题',
		label: '主要问题',
		align: 'left',
		showToolTip: false,
		width: getSize(200),
	},
	{
		prop: '下一步计划',
		label: '下一步计划',
		align: 'left',
		showToolTip: false,
	},
];

export const getExcelData = async (url: string, sheetIndex: number = 0) => {
	console.log(url, sheetIndex);
	return new Promise<void>((resolve, reject) => {
		if (!url) reject();
		axios.get(url, { responseType: 'arraybuffer' }).then((res) => {
			const data = new Uint8Array(res.data);
			const workbook = XLSX.read(data, { type: 'array' });
			const firstSheetName = workbook.SheetNames[sheetIndex];
			const worksheet = workbook.Sheets[firstSheetName];
			// 转换为JSON
			const jsonData: any = XLSX.utils.sheet_to_json(worksheet);
			resolve(jsonData);
		});
	});
};
