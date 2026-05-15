// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },

	modules: ["@nuxt/ui"],

	ui: {
		colorMode: false,
	},

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		public: {
			apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:5000/api",
		},
	},

	app: {
		head: {
			title: "Briefly - AI Document Chat",
			meta: [
				{ name: "description", content: "Chat with your documents using AI" },
			],
			link: [
				{ rel: "preconnect", href: "https://fonts.googleapis.com" },
				{
					rel: "preconnect",
					href: "https://fonts.gstatic.com",
					crossorigin: "",
				},
				{
					rel: "stylesheet",
					href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
				},
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			],
		},
	},

	typescript: {
		strict: true,
	},

	future: {
		compatibilityVersion: 4,
	},
});
