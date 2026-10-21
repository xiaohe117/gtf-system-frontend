/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// declare module '*.json' {
//   const value: any;
//   export default value;
// }
declare module '@liveqing/liveplayer-v3';
declare module 'element-plus/dist/locale/zh-cn.mjs';
declare module 'echarts-gl/charts';

// 扩展 relation-graph-vue3 组件类型
declare module 'relation-graph-vue3' {
	const RelationGraph: any;
	export default RelationGraph;
}
declare module 'echarts-gl/components';