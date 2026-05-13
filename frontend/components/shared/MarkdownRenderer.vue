<template>
	<div class="markdown-body" v-html="rendered" />
</template>

<script setup lang="ts">
	import { marked } from "marked";

	const props = defineProps<{
		content: string;
	}>();

	marked.use({
		breaks: true,
		renderer: {
			link({ href, title, text }) {
				const titleAttr = title ? ` title="${title}"` : "";
				return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
			},
		},
	});

	const rendered = computed(() => {
		if (!props.content) return "";
		return marked(props.content) as string;
	});
</script>
