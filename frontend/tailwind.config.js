/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
		extend: {
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				'ecru-white': {
					50: '#FFFFFE',
					100: '#FEFEFD',
					200: '#FEFDFA',
					300: '#FDFCF6',
					400: '#FBF9F0',
					500: '#F9F7E9',
					600: '#E0DED2',
					700: '#95948C',
					800: '#706F69',
					900: '#4B4A46',
				},
				'green-vogue': {
					50: '#F3F4F6',
					100: '#E6EAED',
					200: '#C1CAD3',
					300: '#9CAAB8',
					400: '#516B83',
					500: '#072B4E',
					600: '#062746',
					700: '#041A2F',
					800: '#031323',
					900: '#020D17',
				},
				'christi': {
					50: '#FFFDF5',
					100: '#FFFCEB',
					200: '#FEF7CE',
					300: '#FDF2B0',
					400: '#FCE875',
					500: '#FBDE3A',
					600: '#E2C834',
					700: '#978523',
					800: '#71641A',
					900: '#4B4311',
				},
				'azure': {
					50: '#F4F7FA',
					100: '#E9EFF5',
					200: '#C7D7E6',
					300: '#A5BED7',
					400: '#628EBA',
					500: '#1E5D9C',
					600: '#1B548C',
					700: '#12385E',
					800: '#0E2A46',
					900: '#091C2F',
				},
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
		}
	},
	plugins: [],
}