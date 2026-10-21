<template>
	<div class="content-panel">
		<EmptyData v-if="!industry" />
		<template v-else>
			<div class="tab-inner">
				<div
					v-for="(tab, index) in tabs"
					:key="index"
					class="item"
					:class="[tab.sizeClass, { active: activeTab === index }]"
					@click="activeTab = index"
				>
					<img
						class="tab-img"
						:src="activeTab === index ? tab.active : tab.normal"
						:class="tab.imgClass"
						alt=""
					/>
				</div>
				<img
					v-if="activeTab === 4"
					class="full-screen"
					src="@/assets/images/industry/full-screen.svg"
					alt=""
					@click="openFullScreen"
				/>
			</div>
			<div class="content-wrap">
				<ElementComp
					v-if="activeTab === 0"
					:industry-code="industry?.key"
					:industry-label="industry?.label"
				/>
				<ActionComp v-if="activeTab === 1" :industry-code="industry?.key" />
				<KeyEnterprises
					v-if="activeTab === 2"
					:industry-code="industry?.key"
					:industry-label="industry?.label"
				/>
				<AnalysisSuggest v-if="activeTab === 3" :industry-code="industry?.key" />
				<EmpowermentTool v-if="activeTab === 4" :industry-code="industry?.key" />
			</div>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import tab1 from '@/assets/images/industry/tab-1.webp';
import tab1Act from '@/assets/images/industry/tab-1-act.webp';
import tab2 from '@/assets/images/industry/tab-2.webp';
import tab2Act from '@/assets/images/industry/tab-2-act.webp';
import tab3 from '@/assets/images/industry/tab-3.webp';
import tab3Act from '@/assets/images/industry/tab-3-act.webp';
import tab4 from '@/assets/images/industry/tab-4.webp';
import tab4Act from '@/assets/images/industry/tab-4-act.webp';
import tab5 from '@/assets/images/industry/tab-5.webp';
import tab5Act from '@/assets/images/industry/tab-5-act.webp';
import ElementComp from '@/views/CommandCenter/ClassifiedByIndustry/components/ElementComp.vue';
import ActionComp from '@/views/CommandCenter/ClassifiedByIndustry/components/ActionComp.vue';
import KeyEnterprises from '@/views/CommandCenter/ClassifiedByIndustry/components/KeyEnterprises.vue';
import AnalysisSuggest from '@/views/CommandCenter/ClassifiedByIndustry/components/AnalysisSuggest.vue';
import EmpowermentTool from '@/views/CommandCenter/ClassifiedByIndustry/components/EmpowermentTool.vue';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import useEmpowermentUrl from '../composables/useEmpowermentUrl';
import type { IndustryItem } from '../type';

const props = defineProps({
	industry: {
		type: Object as () => IndustryItem | undefined,
		default: () => undefined,
	},
});

const tabs = [
	{ normal: tab1, active: tab1Act, sizeClass: '', imgClass: '' },
	{ normal: tab2, active: tab2Act, sizeClass: '', imgClass: '' },
	{ normal: tab3, active: tab3Act, sizeClass: 'item-large', imgClass: 'tab-img-wide' },
	{ normal: tab4, active: tab4Act, sizeClass: '', imgClass: '' },
	{ normal: tab5, active: tab5Act, sizeClass: 'item-medium', imgClass: 'tab-img-medium' },
];

const activeTab = ref<number>(0);
const { iframeSrc } = useEmpowermentUrl(() => props.industry?.key);

const openFullScreen = () => {
	const src = iframeSrc.value;
	if (src) window.open(src, '_blank');
};
</script>

<style lang="less" scoped>
.content-panel {
	flex: 1;
	height: 100%;
	border-radius: 0.08rem;
	padding: 0.16rem 0.16rem 0;
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
	background-image: url('@/assets/images/industry/content-bg.webp');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-position: 0 0;
	.tab-inner {
		position: relative;
		display: flex;
		height: 1.06rem;
		padding: 0 1.8rem;
		align-items: center;
		justify-content: space-between;

		.item {
			position: relative;
			height: 100%;
			cursor: pointer;
			transition: all 0.3s ease;

			.tab-img {
				width: 1.26rem;
				transition: opacity 0.3s ease;
			}

			&.item-large .tab-img-wide {
				width: 2.3rem;
			}

			&.item-medium .tab-img-medium {
				width: 1.76rem;
			}

			&:hover:not(.active) {
				opacity: 0.8;
			}
		}
		.full-screen {
			position: absolute;
			right: 0.2rem;
			bottom: 0;
			width: 0.75rem;
			height: 0.34rem;
			cursor: pointer;
			transition: opacity 0.3s ease;
			&:hover {
				opacity: 0.8;
			}
		}
	}
	.content-wrap {
		flex: 1;
		min-height: 0;
		max-width: 100%;
		box-sizing: border-box;
	}
}
</style>
