<template>
	<FrameBox class="fx-w">
		<TitleBody name="找目标企业">
			<div class="search-container fx-r fx-al-c">
				<el-input class="search-input fx-1" v-model="searchValue" placeholder="请输入搜索">
					<template #append>
						<div class="search-button" @click="handleSearch()">查一下</div>
					</template>
				</el-input>
				<el-button class="advanced-search" @click="handleAdvancedSearch()">
					高级搜索
					<span
						class="double-arrow arrow-down"
						:class="{ 'arrow-up': isAdvanced }"
					></span>
				</el-button>
			</div>
			<transition name="fade">
				<LeftMainSearch
					v-show="isAdvanced"
					ref="leftMainSearchRef"
					:originalData="originalData"
				/>
			</transition>
			<div class="main-content fx-r fx-sp-b fx-h">
				<LeftMainCon1 v-if="displayMainCon === 1" />
				<LeftMainCon2
					v-else
					ref="leftMainCon2Ref"
					:searchForm="searchForm"
					:originalData="originalData"
					@goBack="goBack"
				/>
			</div>
		</TitleBody>
	</FrameBox>
</template>

<script setup lang="ts">
import { getExcelData } from '@/views/ToufawOverview/data';
import LeftMainCon1 from './LeftMainCon1.vue';
import LeftMainCon2 from './LeftMainCon2.vue';
import LeftMainSearch from './LeftMainSearch.vue';

const leftMainSearchRef = ref();
const leftMainCon2Ref = ref();

const searchValue = ref('');
const displayMainCon = ref(1);

// 搜索表单
const searchForm = ref<any>({});

// 高级搜索
const isAdvanced = ref(false);

// 返回
const goBack = () => {
	searchValue.value = '';
	leftMainSearchRef.value?.resetForm();
	displayMainCon.value = 1;
};
const handleAdvancedSearch = () => {
	isAdvanced.value = !isAdvanced.value;
};

// 获取到excel表格数据
const originalData = ref<any[]>([]);
const getListData = () => {
	getExcelData('./excel/runByEnterprise/targetEnterpriseList.xlsx', 0).then((res: any) => {
		originalData.value = res;
	});
};
getListData();

// 查一下
const handleSearch = () => {
	displayMainCon.value = 2;
	leftMainCon2Ref.value?.getCompanyList();
};

watch(
	() => [searchValue.value, leftMainSearchRef.value?.formInline],
	() => {
		searchForm.value = {
			keyword: searchValue.value,
			...leftMainSearchRef.value?.formInline,
		};
	},
	{
		deep: true,
	}
);
</script>

<style lang="less" scoped>
.search-container {
	height: 0.65rem;
	.search-input {
		padding-left: 0.32rem;
		height: 100%;
		background: #ffffff;
		box-shadow: 0rem 0.04rem 0.1rem 0rem rgba(0, 0, 0, 0.1);
		border-radius: 0.33rem;
		border: 0.02rem solid #aaccff;

		:deep(.el-input__wrapper) {
			box-shadow: none;
			padding: 0;
			.el-input__inner {
				font-weight: 400;
				font-size: 0.24rem;
				line-height: 0.33rem;
			}
		}
		:deep(.el-input-group__append) {
			background: none !important;
			box-shadow: none;
			padding: 0;
		}
	}

	.search-button {
		cursor: pointer;
		width: 1.52rem;
		height: 100%;
		background: linear-gradient(180deg, #5dc9fc 0%, #1b4df4 100%);
		border-radius: 0.33rem;
		border-image: linear-gradient(138deg, rgba(153, 200, 255, 1), rgba(182, 241, 255, 1)) 1 1;
		cursor: pointer;
		font-weight: 500;
		font-size: 0.24rem;
		color: #ffffff;
		text-align: center;
		line-height: 0.65rem;
	}
	.advanced-search {
		margin-left: 0.16rem;
		padding: 0.16rem 0.27rem 0.16rem 0.32rem;
		height: 100%;
		width: 1.84rem;
		height: 0.65rem;
		background: rgba(255, 255, 255, 0.7);
		border-radius: 0.33rem;
		border: 0.01rem solid #ffffff;
		backdrop-filter: blur(0.1rem);
		font-weight: 400;
		font-size: 0.24rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.33rem;
		cursor: pointer;
		.double-arrow {
			margin-left: 0.08rem;
			display: inline-block;
			width: 0.24rem;
			height: 0.25rem;
			background-image: url('@/assets/images/runByEnterprise/double-arrow-down.png');
			background-size: 100% 100%;
			&.arrow-up {
				transform: rotate(180deg);
			}
		}
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s ease;
	transform: translateY(-0.1rem);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-0.2rem);
}
.main-content {
	padding: 0.36rem 0.14rem 0.12rem;
	column-gap: 0.24rem;
}

:deep(.title-body-content) {
	display: flex;
	flex-direction: column;
}
</style>
