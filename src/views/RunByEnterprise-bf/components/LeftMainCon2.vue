<!-- 搜索列表 -->
<template>
	<div class="search-list-box fx-c">
		<div class="small-title fx-r fx-al-c">
			<div class="btn" @click="handleGoBack">
				<span class="btn-content">
					<el-icon><ArrowLeftBold /></el-icon>返回
				</span>
			</div>
			<div class="title">
				<span class="text"
					>搜索到 <span class="number-font">{{ listToatl }}</span> 家相关企业</span
				>
			</div>
		</div>
		<div class="search-list fx-h ov-y">
			<RectPanelListItem
				v-for="(item, index) in companyList"
				:key="index"
				:companyList="item"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import RectPanelListItem from './RectPanelListItem.vue';

const props = defineProps<{
	searchForm: any;
	originalData: any;
}>();

const emits = defineEmits(['goBack']);

const handleGoBack = () => {
	emits('goBack');
};
// 获取榜单企业列表
const listToatl = ref(0);
const companyList = ref<any[]>([]);
const getCompanyList = () => {
	const filteredData = props.originalData?.filter((item: any) => {
		// 1. 关键词搜索 (名称模糊搜索或信用代码精准匹配)
		const keywordMatch =
			props.searchForm.keyword === '' ||
			item.name.includes(props.searchForm.keyword) ||
			item?.creditCode === props.searchForm.keyword;

		// 2. 高级搜索条件
		const industryTypeMatch =
			!props.searchForm.industryType || item.industryType === props.searchForm.industryType;
		const areaMatch = !props.searchForm.area || item.area === props.searchForm.area;
		const companyTypeMatch =
			!props.searchForm.companyType || item.companyType === props.searchForm.companyType;
		const isHasProjectMatch =
			!props.searchForm.isHasProject || item.isHasProject === props.searchForm.isHasProject;
		const followUnitMatch =
			!props.searchForm.followUnit || item.followUnit === props.searchForm.followUnit;
		const investmentTypeMatch =
			!props.searchForm.investmentType ||
			item.investmentType === props.searchForm.investmentType;

		return (
			keywordMatch &&
			industryTypeMatch &&
			areaMatch &&
			companyTypeMatch &&
			isHasProjectMatch &&
			followUnitMatch &&
			investmentTypeMatch
		);
	});

	listToatl.value = filteredData?.length;
	companyList.value = filteredData?.map((item: any) => ({
		name: item.name,
		tags: [item.industryType, item.tag].filter(Boolean),
		unit: item.followUnit,
		location: item.register,
		type: item.companyType,
		isDetail: !!(
			item.name === '中国石油化工集团有限公司' || item.name === '中国南方电网有限责任公司'
		),
	}));
};
getCompanyList();

defineExpose({
	getCompanyList,
});
</script>

<style lang="less" scoped>
.btn {
	display: inline-block;
	cursor: pointer;
	margin-right: 0.1rem;
	.btn-content {
		display: flex;
		align-items: center;
		line-height: 0.22rem;
		background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
		color: #fff;
		border-radius: 0.23rem;
		padding: 0.08rem 0.22rem;
		font-size: 0.16rem;
	}
}
.search-list-box {
	width: 100%;
	height: 100%;
}
.small-title {
	margin-bottom: 0.16rem;
	.title {
		position: relative;
		padding-left: 0.27rem;
		.text {
			display: block;
			position: relative;
			z-index: 2;
			font-size: 0.2rem;
			line-height: 0.28rem;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.85);
		}
		&::before {
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			display: inline-block;
			width: 2.36rem;
			height: 0.19rem;
			background-image: url('@/assets/images/runByEnterprise/small-title-bg.png');
			background-size: 100% 100%;
		}
		.number-font {
			color: #3a73de;
		}
	}
}
</style>
