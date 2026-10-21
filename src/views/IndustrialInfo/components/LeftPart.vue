<template>
	<iframe src="http://10.205.25.135:9001/zszh/#/singlePage/cygk/chanye-guihua" frameborder="0"></iframe>
	<!-- <FrameBox>
		<TitleBody name="招商产业“3+5”">
			<MultipleTabs
				:tab-list="tabInfoData"
				:top-tab-list="topTabInfoData"
				@changeTab="changeTab"
			>
				<template #showArea>
					<component :is="componentId"></component>
				</template>
			</MultipleTabs>
		</TitleBody>
	</FrameBox> -->
</template>

<!-- <script setup lang="ts">
import MultipleTabs from '@/components/widget/MultipleTabs.vue';
import IndustrialPolicy from "./IndustrialPolicy.vue"
import IndustrialInvestment from "./IndustrialInvestment.vue"
import EmptyArea from "./EmptyArea.vue"

type Component = any;

const tabInfoData = [
	{ label: '生物医药与健康', value: '1' },
	{ label: '智能网联与新能源汽车', value: '2' },
	{ label: '具身智能', value: '3' },
	{ label: '船舶与海洋工程', value: '4' },
	{ label: '超高清视频与新型显示', value: '5' },
	{ label: '半导体与集成电路', value: '6' },
	{ label: '生物制造', value: '7' },
	{ label: '细胞与基因', value: '8' },
	{ label: '智能装备与机器人', value: '9' },
	{ label: '时尚消费品', value: '10' },
	{ label: '软件与互联网', value: '11' },
];

const topTabInfoData = [
	[
		{ label: '产业规划', value: '1' },
		{ label: '产业政策', value: '2' },
		{ label: '产业布局', value: '3' },
	],
	[
		{ label: '园区', value: '4' },
		{ label: '人才', value: '5' },
		{ label: '科技', value: '6' },
		{ label: '服务', value: '7' },
		{ label: '基金', value: '8' },
	],
	[{ label: '产业招商', value: '9' }],
];

const ComponentListForTabs: { [key: string]: any } = {
	// 生物医药与健康
	1: {
		// 产业政策
		2: {
			component: IndustrialPolicy,
		},
		// 产业招商
		9: {
			component: IndustrialInvestment,
		},
	},
};


const componentId = ref<Component>();

const loading = ref(true);

const loadComponent = (com: Component) => {
	// load component
	componentId.value = com;
	// close loading
	loading.value = false;
};


const loadTabComponent = (tabs: [string, string]) => {
	loading.value = true;
	const [first, second] = tabs;
	const comObj = ComponentListForTabs[first] ? ComponentListForTabs[first][second] : null;
	loadComponent(comObj ? comObj.component : EmptyArea);
};

const changeTab = (tabs: [string, string]) => {
	loadTabComponent(tabs);
};

onMounted(() =>
{
	changeTab(['1','1'])
})
</script> -->

<style lang="less" scoped>
iframe {
	flex: 1;
}
</style>
