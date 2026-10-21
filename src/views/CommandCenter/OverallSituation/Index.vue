<!--
 * @Descripttion: 整体情况
 * @Author: ycyun
 * @Date: 2026-03-26 14:42:30
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-18 17:48:26
-->
<template>
	<DeptOverview v-if="isDeptAdmin" />
	<Comps class="overall-situation" v-else />
</template>
<script lang="ts" setup>
import Comps from '@/views/newOverallSituation/Index.vue';
import { authService } from '@/services/auth';
import DeptOverview from './DeptOverview/Index.vue';

// 单位管理员登陆后系统后，直接展示本部门的招商总览页面,市管理员直接查看整体情况页面
// 判断逻辑--》不是市管理员sk_tfw、分局管理员sk_fjgly的且是 单位管理员sk_gqbm或者区级管理员sk_qjgly显示显示部门总览页，否则显示含地图的整体情况；
const isDeptAdmin = computed(() => {
	const userInfo = authService?.getUserInfo() as any;
	const mainRoles = ['sk_tfw','sk_fjgly']
	const deptRoles = ['sk_gqbm','sk_qjgly']
	const roles:any = userInfo.role || []
	if(!roles.find((r:any) => mainRoles.includes(r)) && roles.find((r:any) => deptRoles.includes(r))){
		// 是市管理员sk_tfw、分局管理员sk_fjgly直接显示地图
		return true
	}
	return false;
});
</script>
<style lang="less" scoped>
.overall-situation {
	padding: 0 !important;
}
</style>