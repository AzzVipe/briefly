```vue
<template>
	<div class="app-background">
		<div class="app-glow app-glow--cyan" />
		<div class="app-glow app-glow--violet" />
	</div>
</template>

<style scoped>
	.app-background {
		position: fixed;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.app-glow {
		position: absolute;
		border-radius: 9999px;
		filter: blur(120px);
		opacity: 0.14;
		will-change: transform;
	}

	.app-glow--cyan {
		width: 420px;
		height: 420px;
		background: #06b6d4;
		top: -120px;
		left: -120px;
	}

	.app-glow--violet {
		width: 520px;
		height: 520px;
		background: #7c3aed;
		bottom: -220px;
		right: -120px;
	}
</style>
```
