<template>
	<div class="link-box">
		<div v-if="typeTab === 0 && tfwData.code" class="list-item-sp" @click="handleClick(tfwData)">
			{{tfwData.name}}
		</div>
		<div class="link-list">
			<div
				:class="['link-list-item','over-ellipsis']"
				v-for="(item, index) in linkList"
				:key="index"
				@click="handleClick(item)"
			>
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script lang='ts' setup>
import { useRouter } from 'vue-router';
import { queryRegionDeptList } from '@/api/commandCenter/deptOverview';

const props = defineProps({
	typeTab: {
		type: Number,
		default: 0,
	},
});
const router = useRouter();
// const linkList = computed(() => {
//   if (props.typeTab === 0) {
//     return [
//       {
//         title: "黄埔",
//         link: "",
//       },
//       {
//         title: "番禺",
//         link: "",
//       },
//       {
//         title: "南沙",
//         link: "/nanshaDistrict",
//       },
//       {
//         title: "海珠",
//         link: "",
//       },
//       {
//         title: "花都",
//         link: "",
//       },
//       {
//         title: "荔湾",
//         link: "",
//       },
//       {
//         title: "增城",
//         link: "",
//       },
//       {
//         title: "越秀",
//         link: "",
//       },
//       {
//         title: "天河",
//         link: "",
//       },
//       {
//         title: "从化",
//         link: "",
//       },
//       {
//         title: "白云",
//         link: "",
//       },

//     ];
//   }
//   if (props.typeTab === 1) {
//     return [
//       {
//         title: "工信局",
//         // link: "/industrialInfo",
//         link:""
//       },
//       {
//         title: "发改委",
//         link: "",
//       },
//       {
//         title: "科技局",
//         link: "",
//       },
//       {
//         title: "商务局",
//         link: "",
//       },
//       {
//         title: "文广旅",
//         link: "",
//       },
//       {
//         title: "金融办",
//         link: "",
//       },
//       {
//         title: "住建局",
//         link: "",
//       },
//       {
//         title: "规自局",
//         link: "",
//       }
//     ];
//   }
//   return [];
// });
const handleClick = (item: any) => {
	router.push({
		path: `/deptOverview/${item.code}`,
		query: {
			styleCategory: item.styleCategory,
			name:item.name,
			type:item.type
		},
	});
};
const linkList: any = ref([]);
const tfwData:any = ref({});
const getList = () => {
	// 招商主战 或 招商主建
	const obj: any = {
		0: '招商主战',
		1: '招商主建',
	};
	queryRegionDeptList({ type: obj[props.typeTab] }).then((res: any) => {
		if (props.typeTab === 0) {
			tfwData.value = res.data?.find((item: any) => item.styleCategory === '03') || {};
			linkList.value = res.data?.filter((item: any) => item.code !== tfwData.value.code) || [];
		}else{
			linkList.value = res.data || []
		}
		
	});
};
watch(
	() => props.typeTab,
	() => {
		getList();
	},
	{ immediate: true }
);
</script>

<style scoped lang="less">
.link-box {
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: space-between;
	margin: 0 0.3rem;
	.list-item-sp {
		cursor: pointer;
		font-size: @g-font-size-base;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.7);
		line-height: 0.6rem;
		margin-top: 0.06rem;
		margin-bottom: 0.14rem;
		flex-shrink: 0;
		height: 0.6rem;
		background-image: url('@/assets/images/OverallSituation/big-bg.png');
		background-size: 100% 100%;
		font-weight: 500;
		font-size: @g-font-size-base;
		color: rgba(0, 0, 0, 0.65);
		&:hover {
			color: #ffffff;
			background-image: url('@/assets/images/OverallSituation/select-big-bg.png');
			background-size: 100% 100%;
		}
	}
	.link-list {
		margin-top: 0.06rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		flex-shrink: 0;
		font-size: @g-font-size-base;
		gap: 0.2rem;
		justify-content: space-between;
		.link-list-item {
			cursor: pointer;
			font-weight: 500;
			font-size: @g-font-size-base;
			color: rgba(0, 0, 0, 0.65);
			width: 1.6rem;
			height: 0.64rem;
			line-height: 0.64rem;
			background-image: url('@/assets/images/OverallSituation/small-bg.png');
			background-size: 100% 100%;
			&:hover {
				color: #ffffff;
				background-image: url('@/assets/images/OverallSituation/select-small-bg.png');
				background-size: 100% 100%;
			}
		}
	}
}
</style>
