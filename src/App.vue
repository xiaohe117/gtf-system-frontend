<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-01-07 17:29:40
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-14 18:02:29
-->
<template>
	<div class="app-container">
		<router-view />
	</div>
</template>

<script setup lang="ts">
import authService from '@/services/auth';
import router from '@/router/index'

// 父页面：监听 message 事件
window.addEventListener('message',  (e) => {
  console.log('收到子页面消息：', e);
  const { type } = e.data
  if(type === "redirectToThirdPartyLogin"){
	//  接收子页面重定向登陆页面
	  sessionStorage.setItem('redirect_url', router.currentRoute.value.fullPath)
	  authService.redirectToThirdPartyLogin()
  }
  if(type === "loginTimeout"){
	//  接收子页面登录超时信息
	 sessionStorage.setItem('redirect_url', router.currentRoute.value.fullPath)
	 authService.loginTimeout()
  }
});
</script>

<style lang="less">
#app {
	width: 100%;
  height: 100%;
}
.app-container {
	display: flex;
	width: 100%;
	flex-direction: column;
	height: 100%;
	background: url('@/assets/images/menuLayout/back.png');
	background-size: 100% 100%;
}
::-webkit-scrollbar {
	width: 0.08rem;
}
::-webkit-scrollbar-track {
background: #eef2fd;
	border-radius: 0.05rem;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
	border-radius: 0.05rem;
	background-color: #bcc3f1;
}
</style>
