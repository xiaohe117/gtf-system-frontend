<template>
	<RelationGraph
		ref="graphRef"
		:options="graphOptions"
		@node-click="onNodeClick"
		style="width: 100%; height: 100%"
	>
		<template #node="{ node }">
			<div class="custom-node" :class="[node.data.color]">
				<span class="name">{{ node.text }}</span>
			</div>
		</template>
		<template #node-expand-holder="{ nodeProps, expandButtonClass, expandOrCollapseNode }">
			<button
				:class="['custom-expand', expandButtonClass, nodeProps.data.color]"
				@click="expandOrCollapseNode"
				@touchstart="expandOrCollapseNode"
			>
				{{ nodeProps.data.childNum }}
			</button>
		</template>
	</RelationGraph>
</template>

<script setup lang="ts">
import RelationGraph from 'relation-graph-vue3';
import { getSize } from '@/utils';

const props = defineProps<{
	graphApiData: any;
}>();

const graphRef = ref<any>(null);

const graphOptions: any = {
	layout: {
		layoutName: 'tree',
		from: 'left',
		min_per_width: getSize(570),
		max_per_width: getSize(600),
		max_per_height: getSize(80),
	},
	allowShowMiniToolBar: false,
	defaultNodeBorderWidth: 0,
	defaultJunctionPoint: 'lr',
	reLayoutWhenExpandedOrCollapsed: true,
	defaultExpandHolderPosition: 'right',
	useAnimationWhenExpanded: true,
};

const onNodeClick = (params: any) => {
	console.log('onNodeClick', params);
};

// 递归处理子节点
const loopChildren = async (childrenData: any, data: any) => {
	// 检查是否有子节点
	if (!childrenData.childrenList) return;

	for (let i = 0; i < childrenData.childrenList.length; i += 1) {
		const child = childrenData.childrenList[i];

		// 1. 构建节点数据
		data.nodes.push({
			id: String(child.serialNo),
			text: child.indicatorName,
			// 保留 expanded 属性以控制展开/折叠状态
			expanded: !!childrenData.childrenList[i].childCount,
			data: {
				childNum: childrenData.childrenList[i].childCount || 0,
			},
		});

		// 2. 构建连线数据 - [保留样式]
		data.lines.push({
			from: String(childrenData.serialNo), // 父节点 ID
			to: String(child.serialNo), // 子节点 ID
			// 恢复连线样式：曲线 (对应 defaultLineShape: 4)
			lineShape: 2,
			// 恢复连线颜色
			color: 'rgba(47, 106, 247, 0.08)',
		});

		// 3. 如果当前子节点还有下级，继续递归
		if (child.childrenList && child.childrenList.length > 0) {
			// eslint-disable-next-line no-await-in-loop
			await loopChildren(child, data);
		}
	}
};

const setGraphData = async (treeData: any) => {
	const data: any = {
		nodes: [],
		lines: [],
	};

	// 1. 处理根节点
	data.nodes.push({
		id: String(treeData.serialNo),
		text: treeData.indicatorName,
		expanded: true, // 默认展开根节点,
		data: {
			childNum: treeData.childCount || 0,
		},
	});

	// 2. 处理第一层子节点
	if (treeData.childrenList) {
		for (let i = 0; i < treeData.childrenList.length; i += 1) {
			const child = treeData.childrenList[i];

			// 默认展开第一个节点
			const expanded = i === 0;

			data.nodes.push({
				id: String(child.serialNo),
				text: child.indicatorName,
				expanded,
			});

			// 添加连线
			data.lines.push({
				from: String(treeData.serialNo),
				to: String(child.serialNo),
				lineShape: 2, // 曲线
				color: 'rgba(47, 106, 247, 0.08)',
			});

			// 递归处理更深层级的子节点
			if (child.childrenList && child.childrenList.length > 0) {
				// eslint-disable-next-line no-await-in-loop
				await loopChildren(child, data);
			}
		}
	}

	return data;
};
const initData = async () => {
	if (Object.keys(props.graphApiData).length > 0) {
		const graphData = await setGraphData(props.graphApiData);
		const graphInstance = graphRef.value?.getInstance();
		if (graphInstance) {
			await graphInstance.setJsonData(graphData);
			await graphInstance.moveToCenter();
			await graphInstance.zoomToFit();
		}
	}
};

watch(
	() => props.graphApiData,
	() => {
		initData();
	},
	{
		immediate: true,
		deep: true,
	}
);
</script>

<style lang="less" scoped>
.relation-graph {
	:deep(.rel-node-checked) {
		box-shadow: none !important;
	}
	:deep(.rel-node) {
		border: none !important;
		background-color: transparent !important;
	}
}
// 自定义节点样式
.custom-node {
	cursor: pointer;
	height: 0.46rem;
	background: linear-gradient(90deg, rgba(47, 107, 239, 0.2) 0%, rgba(47, 107, 239, 0.06) 100%);
	border-radius: 0.04rem;
	border: 0.01rem solid rgba(47, 107, 239, 0.1);
	display: flex;
	align-items: center;
	position: relative;
	width: 2.5rem;
	padding: 0.1rem 0.2rem;
	box-sizing: border-box;
	&::before {
		content: '';
		position: absolute;
		top: 0.08rem;
		left: 0;
		width: 0.02rem;
		height: 0.3rem;
		background: #2f6bef;
	}
	.name {
		font-weight: 500;
		font-size: 0.18rem;
		color: #333;
	}
}
// 自定义展开/缩起按钮样式
.custom-expand {
	font-size: 0.16rem;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	color: #4e5969;
	position: absolute;
	right: -0.32rem;
	top: 50%;
	transform: translate(20%, -50%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	z-index: 1;
	cursor: pointer;
	border-radius: 50%;
	width: 0.31rem;
	height: 0.31rem;
	border: none;
	background-image: none !important;
	background: #eaf0ff;
	border: 0.01rem solid #eaf0ff;
	&.c-collapsed {
		font-size: 0.16rem;
		border: 0.01rem solid #2f6bef;
		color: #2f6bef;
	}
}
</style>
