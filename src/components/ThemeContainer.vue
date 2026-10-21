<template>
	<div class="l">
		<slot name="left" />
	</div>
	<div class="r">
        <slot name="right" />
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.l, .r{
    width: 19.8rem;
    height: 8.96rem;
    position: absolute;
    top: 1.36rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: space-between;
}
.l{
    left: .5rem;
}
.r{
    right: .5rem;
}
</style>
