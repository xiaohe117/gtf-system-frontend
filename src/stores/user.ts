/*
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-09-15 17:28:16
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-01 10:28:52
 */
import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
	state: (): {
		tabSubSelect: string;
		lastRoute: string;
		provinceName: string;
		continentName: string;
		mapMode:Number; // 地图模式，0世界，1中国，默认中国
		selectedHotCity: string; // 选中的热门城市
		sideMenus:Array<any>, // 侧边菜单栏数据
		sideMenusIsExpand: Boolean, // 侧边菜单栏是否展开
		activeMenus:Object
		dateSelect: string;
	} => ({
		tabSubSelect: '/runByEnterprise',
		lastRoute: '',
		provinceName: '',
		continentName: '',
		mapMode:1,
		selectedHotCity: '',
		sideMenus:[],
		sideMenusIsExpand:false, // 默认不展开
		activeMenus:{},
		dateSelect: '2026年1-3月',
	}),
	actions: {
        setTabSubSelect(path: string) {
            this.tabSubSelect = path;
        },
        setLastRoute(path: string) {
            this.lastRoute = path;
        },
		setProvinceName(name: string) {
			this.provinceName = name;
		},
		setContinentName(name: string) {
			this.continentName = name;
		},
		setMapMode(mode:Number){
			this.mapMode = mode
		},
		setSelectedHotCity(cityName: string) {
			this.selectedHotCity = cityName;
		},
		setSideMenus(menus: Array<any>) {
			this.sideMenus = menus;
		},
		setSideMenusIsExpand(status: Boolean) {
			this.sideMenusIsExpand = status;
		},
		setActiveMenus(data:Object) {
			this.activeMenus = data;
		},
		setDateSelect(date: string)	{
			this.dateSelect = date;
		},
    },
	getters: {},
	persist: {
		enabled: true, 
	},
});

export default useUserStore;
