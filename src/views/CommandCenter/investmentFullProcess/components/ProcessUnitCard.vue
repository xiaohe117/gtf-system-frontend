<template>
	<PlanningCard v-if="item.card === 'planning'" />
	<MeetingCard v-else-if="item.card === 'meeting'" />
	<LeadsCard v-else-if="item.card === 'leads'" />
	<ProjectStageCard v-else :stage="stageMap[item.card]" />
</template>

<script setup lang="ts">
import type { ProcessItem } from '../processLayout';
import PlanningCard from './PlanningCard.vue';
import MeetingCard from './MeetingCard.vue';
import LeadsCard from './LeadsCard.vue';
import ProjectStageCard from './ProjectStageCard.vue';

defineProps<{
	item: ProcessItem;
	stageMap: Record<string, any>;
}>();
</script>
