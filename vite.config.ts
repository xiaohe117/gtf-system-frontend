import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import eslintPlugin from 'vite-plugin-eslint';

// 将index-hash.css的文件放在最后面导入
const cssOrderPlugin = () => ({
	name: 'css-order-plugin',
	enforce: 'post',
	transformIndexHtml(html:any) {
	  const regex = /<link rel="stylesheet"[^>]*href="[^"]*index-[^.]*\.css"[^>]*>/g;
        const links = html.match(regex);
        if (links) {
          let newHtml = html;
          links.forEach((link:any) => {
            newHtml = newHtml.replace(link, '');
          });
          const headEnd = newHtml.indexOf('</head>');
          if (headEnd !== -1) {
            newHtml = newHtml.slice(0, headEnd) + links.join('\n') + '\n' + newHtml.slice(headEnd);
          }
          return newHtml;
        }
        return html;
	}
  })
// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		vue(),
		eslintPlugin(),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
		AutoImport({
			resolvers: [ElementPlusResolver()],
			imports: ['vue'],
			dts: 'src/auto-import.d.ts',
			eslintrc: {
				enabled: false,
				// 1、改为true用于生成eslint配置。2、生成后改回false，避免重复生成消耗
			},
		}),
		cssOrderPlugin()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
		extensions: ['.js', '.ts'],
	},
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {
					hack: `true; @import "./src/assets/css/styleVariable.less";`,
				},
				additionalData: `@import "@/assets/css/mixins.less";`,
				javascriptEnabled: true,
			},
		},
	},
	build: {
		// chunkSizeWarningLimit: 1500, // 加大限制的大小将500kb改成1500kb或者更大
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						// 分解块，将大块分解成更小的块,在vite.config.js当中的build下面进行配置
						return id.toString().split('node_modules/')[1].split('/')[0].toString();
						// 但是生成的文件都在dist下面的assets文件下，里面既有js、css等等。
					}
					return '';
				},
				// 可以将不同的文件放在不同的文件下
				chunkFileNames: (chunkInfo) => {
					const facadeModuleId = chunkInfo.facadeModuleId
						? chunkInfo.facadeModuleId.split('/')
						: [];
					const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
					return `js/${fileName}/[name].[hash].js`;
				},
			},
		},
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
		},
	},
	server: {
		host: true,
		port: 5179,
		proxy: {
			'/test-gtf-api': {
				target: 'http://10.205.25.135/',
				// target: 'http://10.153.185.239:30010/',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/\/api/, ''),
			},
			// 本地 iframe 嵌入齐明：走当前域，由代理转发，共享 localStorage 登录态
			'/pc': {
				target: 'http://10.205.25.135/',
				changeOrigin: true,
			},
			// 齐明前端接口前缀（iframe 内请求会打到当前域）
			'/prod-api': {
				target: 'http://10.205.25.135/',
				changeOrigin: true,
			},
		},
	},
});
