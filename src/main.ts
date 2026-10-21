import { createApp } from 'vue';
import dayjs from 'dayjs';
import router from '@/router/index';
import './assets/css/font.css';
import './assets/css/common-rule-class.css';
import './assets/css/globalStyle.less';
import store from '@/stores/index';
import dialog from '@/utils/dialog';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import App from './App.vue';
import '../env.d';
import '@/echartsTheme';
import DAYJS_KEY from './provideSymbol';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-message-box.css';
import '@/assets/icon/index'
import directives from './directives'
import 'echarts-wordcloud'

const app = createApp(App);

// eslint-disable-next-line no-restricted-syntax
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component);
}
app.provide(DAYJS_KEY, dayjs);
app.use(store);
app.use(router);
app.use(dialog);
app.use(ElementPlus, {
	locale: zhCn,
});
app.use(directives)

app.mount('#app');
