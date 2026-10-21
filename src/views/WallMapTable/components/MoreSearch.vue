<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-14 15:54:00
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-08 18:04:16
-->
<template>
	<div class="more-search">
		<div class="top-bg"></div>
		<Title title="高级搜索">
			<template #right>
				<div class="clear-box" @click="clearFunc">
					<div class="content">
						<img src="@/assets/images/wallMapTable/clear.png" alt="" />
						<span>清除搜索条件</span>
					</div>
				</div>
			</template>
		</Title>
		<el-form ref="ruleFormRef" :inline="true" :model="formModel">
			<el-row>
				<el-col v-for="item in items" :key="item.prop" :span="item.span">
					<el-form-item label="" prop="industryType">
						<el-select
							v-if="item.type === 'select'"
							v-model="formModel[item.prop]"
							popper-class="wall-map-more-search"
							style="width: 100%"
							suffix-icon="CaretBottom"
							:placeholder="item.placeholder || '请选择'"
							clearable
							:filterable="item.filterable"
							@change="searchFunc"
						>
							<template #prefix>
								<div>{{ item.label }}：</div>
							</template>
							<el-option
								v-for="o in item.options"
								:key="o.value"
								:label="o.label"
								:value="o.value"
							/>
						</el-select>
						<selectDept
							style="width: 100%"
							v-if="item.type === 'selectDept'"
							:dataType="item.dataType"
							v-model.trim="formModel[item.prop]"
							:label="item.label"
							@change="searchFunc"
						/>
						<el-input
							v-if="item.type === 'input'"
							v-model.trim="formModel[item.prop]"
							maxlength="100"
							placeholder="请输入"
							@input="debouncedSearch"
							clearable
						>
							<template #prefix>
								<div>{{ item.label }}：</div>
							</template>
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>
<script lang="ts" setup>
import { debounce } from 'lodash-es';
import { queryDropDown } from '@/api/wallMapTable/index';
import SelectDept from './SelectDept.vue';
import Title from './Title.vue';

const emits = defineEmits(['search', 'update:modelValue']);
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
	tableData: {
		type: Array,
		default: () => [],
	},
});
function deepClone(source: any) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments');
	}
	const targetObj: any = source.constructor === Array ? [] : {};
	Object.keys(source).forEach((keys) => {
		if (source[keys] && typeof source[keys] === 'object') {
			targetObj[keys] = deepClone(source[keys]);
		} else {
			targetObj[keys] = source[keys];
		}
	});
	return targetObj;
}
const formModel: any = ref({});
watch(
	() => props.modelValue,
	() => {
		formModel.value = deepClone(props.modelValue);
	},
	{ immediate: true, deep: true }
);

const options: any = ref({});

queryDropDown({ type: '12218' }).then((res: any) => {
	if (!res.data || res.data.length === 0) {
		return;
	}
	options.value.industryName = res.data?.map((item: any) => ({
		value: item.value,
		label: item.value,
	}));
});
const items = computed(() => {
	const have = [
		{ label: '有', value: 1 },
		{ label: '无', value: 0 },
	];
	const yesOrNo = [
		{ label: '是', value: 1 },
		{ label: '否', value: 0 },
	];
	// 牵头市领导=>下拉框根据列表展示情况显示
	const respLeaderOptions: any = [];
	const arr = ['孙志洋', '刘炜', '谈静', '江智涛', '赖志鸿', '胡浩', '赵国生', '潘志军'];

	props.tableData?.forEach((item: any) => {
		if (
			item.respLeader &&
			!respLeaderOptions.find((ele: any) => ele.value === item.respLeader)
		) {
			const sort =
				arr.findIndex((ele) => ele === item.respLeader) > -1
					? arr.findIndex((ele) => ele === item.respLeader)
					: 99;
			respLeaderOptions.push({
				label: item.respLeader,
				value: item.respLeader,
				sort,
			});
		}
	});
	console.log(respLeaderOptions);
	respLeaderOptions.sort((a: any, b: any) => a.sort - b.sort);
	return [
		{
			label: '产业体系',
			prop: 'industryName',
			span: 6,
			placeholder: '请选择',
			type: 'select',
			filterable: true,
			options: options.value.industryName,
		},
		{
			label: '牵头市领导',
			prop: 'leaderName',
			span: 6,
			placeholder: '请选择',
			type: 'select',
			options: respLeaderOptions,
		},
		{ label: '责任市级单位', prop: 'deptName', span: 6, type: 'selectDept', dataType: 'other' },
		{ label: '对接情况', prop: 'dynContent', span: 6, type: 'select', options: have },
		{ label: '招商线索', prop: 'investLead', span: 6, type: 'select', options: have },
		{ label: '招商项目', prop: 'investProject', span: 6, type: 'select', options: have },
		{ label: '主攻招引方向', prop: 'mainName', span: 6, type: 'input' },
		{
			label: '是否纳入省重点企业',
			prop: 'whetherInclude',
			span: 6,
			type: 'select',
			options: yesOrNo,
		},
	];
});

const searchFunc = () => {
	emits('update:modelValue', formModel.value);
	emits('search');
};
const debouncedSearch = debounce(searchFunc, 500);
const clearFunc = () => {
	formModel.value = {};
	searchFunc();
};
</script>
<style lang="less" scoped>
.more-search {
	background: linear-gradient(0deg, rgba(199, 227, 255, 0) 0%, #d5eaff 100%);
	border: 1px solid;
	border-image: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)) 1 1;
	padding: 0.2rem;
	padding-bottom: 0;
	position: relative;
	z-index: 1;
	.top-bg {
		background-color: #d5eaff;
		width: calc(1.8rem + 0.18rem + 0.15rem);
		height: 0.52rem;
		position: absolute;
		top: -0.52rem;
		right: 0;
		border-radius: 0rem 0.1rem 0rem 0rem;
		z-index: 1;
		&::before {
			content: '';
			display: inline-block;
			background-color: #eef3ff;
			height: 100%;
			width: 0.19rem;
			border-radius: 0rem 0rem 0.9rem 0rem;
		}
	}
	.el-form-item {
		width: 100%;
		padding-right: 0.24rem;
		margin-right: 0;
		margin-bottom: 0.12rem;

		:deep(.el-form-item__content) {
			display: flex;
		}
		.el-input {
			flex: 1;
			:deep(.el-input__suffix) {
				.el-icon {
					font-size: @g-font-size-base;
					color: rgba(0, 0, 0, 0.65);
				}
			}
		}
		:deep(.el-input__inner),
		:deep(.el-input__prefix-inner),
		:deep(.el-cascader),
		.select-dept {
			font-size: @g-font-size-base;
			height: 0.34rem;
			line-height: 0.34rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
	:deep(.el-select__prefix),
	:deep(.el-select__wrapper),
	:deep(.el-input__wrapper) {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		font-size: @g-font-size-base;
		height: 0.36rem;
		line-height: 0.36rem;
		min-height: 0.36rem;
		border-radius: 0.02rem;
	}
	:deep(.el-select__wrapper) {
		padding: 0rem 0.12rem;
	}
	:deep(.el-select__icon) {
		color: rgba(0, 0, 0, 0.65);
		&.el-select__caret {
			font-size: 0.12rem;
		}
		&.el-select__clear {
			font-size: 0.18rem;
		}
	}
	.clear-box {
		width: 1.84rem;
		height: 0.5rem;
		background: url('@/assets/images/wallMapTable/search-clear-btn.png') center / 100% 100%
			no-repeat;
		padding-left: 0.2rem;
		cursor: pointer;
		.content {
			display: flex;
			align-items: center;
			font-size: @g-font-size-base;
			height: 100%;
			img {
				width: 0.18rem;
				margin-right: 0.04rem;
			}
		}
	}
	.other-item {
		display: flex;
		align-items: center;
		width: 100%;
		.label {
			font-size: 0.14rem;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
		}
		:deep(.content) {
			flex: 1;
		}
	}
}
</style>
<style lang="less">
.wall-map-more-search {
	.el-select-dropdown {
		border-radius: 0.02rem;
	}
	.el-select-dropdown__list,
	.el-select-dropdown__empty {
		padding: 0.06rem 0;
	}
	.el-select-dropdown__item,
	.el-select-dropdown__empty {
		font-size: @g-font-size-base;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		font-family:
			PingFangSC,
			PingFang SC;
		height: 0.36rem;
		min-height: 0.36rem;
		&.is-selected {
			color: var(--el-color-primary);
		}
	}

	.el-select-dropdown__item {
		line-height: 0.36rem;
	}
}
</style>
