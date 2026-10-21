// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
/** 引入柱状图and折线图图表，图表后缀都为 Chart  */
import {
	BarChart,
	type BarSeriesOption,
	LineChart,
	type LineSeriesOption,
	PieChart,
	type PieSeriesOption,
	MapChart,
	type MapSeriesOption,
	GraphChart,
	type GraphSeriesOption,
	LinesChart,
	type LinesSeriesOption,
	EffectScatterChart,
	type EffectScatterSeriesOption,
	ScatterChart,
	type ScatterSeriesOption,
	GaugeChart,
	type GaugeSeriesOption,
} from 'echarts/charts';

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
	TitleComponent,
	type TitleComponentOption,
	TooltipComponent,
	type TooltipComponentOption,
	GridComponent,
	type GridComponentOption,
	DatasetComponent,
	type DatasetComponentOption,
	TransformComponent,
	LegendComponent,
	type LegendComponentOption,
	GraphicComponent,
	type GraphicComponentOption,
	VisualMapComponent,
	type VisualMapComponentOption,
	MarkLineComponent,
	DataZoomComponent,
} from 'echarts/components';

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

import { Lines3DChart, Scatter3DChart } from 'echarts-gl/charts';
import { GlobeComponent } from 'echarts-gl/components';

type ECOption = echarts.ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| PieSeriesOption
	| TitleComponentOption
	| TooltipComponentOption
	| GridComponentOption
	| DatasetComponentOption
	| LegendComponentOption
	| MapSeriesOption
	| GraphicComponentOption
	| VisualMapComponentOption
	| GraphSeriesOption
	| LinesSeriesOption
	| EffectScatterSeriesOption
	| ScatterSeriesOption
	| GaugeSeriesOption
>;

// 注册必须的组件
echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	DatasetComponent,
	TransformComponent,
	LegendComponent,
	GraphicComponent,
	BarChart,
	LabelLayout,
	UniversalTransition,
	CanvasRenderer,
	LineChart,
	PieChart,
	MapChart,
	VisualMapComponent,
	GraphChart,
	LinesChart,
	EffectScatterChart,
	ScatterChart,
	MarkLineComponent,
	GaugeChart,
	Lines3DChart,
	GlobeComponent,
	Scatter3DChart,
	DataZoomComponent,
]);

// 导出
export default echarts;
export type { ECOption };
