<template>
	<ChatWrapper />
</template>

<script setup lang="ts">
	const route = useRoute();
	useHead({
		title: computed(() => {
			const id = typeof route.params.id === "string" ? route.params.id : "Chat";
			return `Briefly — ${id}`;
		}),
	});
</script>

<style scoped></style>
