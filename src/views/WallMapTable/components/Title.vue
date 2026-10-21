<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-15 10:07:38
 * @LastEditors: ycyun
 * @LastEditTime: 2025-08-19 09:36:04
-->
<template >
	<div class="title-box">
         <!-- <img src="@/assets/images/wallMapTable/title-bg.png" alt=""> -->
		<div class="title">{{ title }}</div>
        <div class="right">
           <slot name="right"></slot>
        </div>
	</div>
</template>
<script lang="ts" setup>
defineProps({
	title: {
		type: String,
		default: '',
	},
});
</script>
<style lang="less" scoped>
.title-box {
	font-family: MicrosoftYaHei, MicrosoftYaHei;
	font-weight: bold;
	font-size: 0.18rem;
	color: #3a73de;
	line-height: 0.24rem;
	text-shadow: 0.01rem 0.01rem 0 #ffffff;
    position: relative;
    padding-left: 0.4rem;
    margin-bottom: 0.14rem;
    display: flex;
    align-items: center;
    height: 0.34rem;
    &::before{
        content: '';
        display: inline-block;
        width: 2.57rem;
        height: 0.19rem;
        background: url(@/assets/images/wallMapTable/title-bg.png);
        background-size: 100% 100% ;
        position: absolute;
        z-index: 0;
        left: 0;
        bottom: 0rem;
    }
     .title{
          position: relative;
          z-index: 1;
    }
    .right{
        margin-left:auto ;
    }
}
</style>