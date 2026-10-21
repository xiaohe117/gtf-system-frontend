<template>
    <div class="text-rotation" ref="textCDom">
        <div class="bg">
            <span class="value" ref="textDom">{{ text }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        text: string
        width?: string
        speed?: string
    }>(),
    {
        text: '',
        width: '',
        speed: ''
    }
);

const textCDom = ref();
const textDom = ref();

const width1 = computed(() => props.width);
const speed1 = ref();

watch(() => props.text, () => {
        setTimeout(() => {
            if (textCDom.value.offsetWidth < textDom.value.offsetWidth && !props.speed) {
                const s = textDom.value.offsetWidth - textCDom.value.offsetWidth;
                const v = 5;
                speed1.value = `${s / v  }s`;
            }
        });
    },
    {
        immediate: true
    }
)
watch(() => props.speed, (val) => {
        speed1.value = val;
    },
    {
        immediate: true
    }
)

</script>

<style lang="less" scoped>
.text-rotation {
    max-width: v-bind(width1);
    overflow: hidden;
    .bg {
        width: 100%;
        text-wrap: nowrap;
        animation: marquee-wrap infinite linear;
        animation-duration: v-bind(speed1);
        .value {
            display: inline-block;
            min-width: 100%;
            white-space: nowrap;
            animation: marquee-content infinite linear;
            animation-duration: v-bind(speed1);
        }
        @keyframes marquee-wrap {
            0% {
                transform: translateX(0);
            }

            100% {
                transform: translateX(100%);
            }
        }

        @keyframes marquee-content {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(-100%);
            }
        }
    }
}
</style>
