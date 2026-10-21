
<!--
 * @Descripttion:部门总览页
 * 部门页面入口有两个：1、整体情况根据角色逻辑进入默认所在部门页面，2、左边菜单点击进去
 * @Author: ycyun
 * @Date:  2026-08-05 11:34:13
 * @LastEditors: ycyun
 * @LastEditTime: 2026-08-05 11:34:13
-->
<template >
	<TfwDept :title="title" v-if="isTwfDept"/>
	<GeneralDept :title="title" :deptCode="deptCode" v-else />
</template>
<script lang="ts" setup>
import { authService } from '@/services/auth';
import { useRoute } from 'vue-router';
import GeneralDept from '../GeneralDept/Index.vue';
import TfwDept from '../TfwDept/Index.vue';

const userInfo = computed(() => authService?.getUserInfo() as any);

const route = useRoute();

// 是用户默认总览页的
const isUserDefault = computed(() => route.path.indexOf('overallSituation') > -1);
const deptCode = computed(() => isUserDefault.value ? userInfo.value.orgId : route.query.deptCode);

// 总览页名字
const title = computed(() =>
	isUserDefault.value ? userInfo.value.departmentShortName : route.query.name
);

// 是否投发委部门
const isTwfDept = computed(() =>
	isUserDefault.value ? userInfo.value.bn : route.query.styleCategory === '03'
);
</script>