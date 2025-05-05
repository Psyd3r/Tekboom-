
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#1E88E5',
					hover: '#1976D2',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#0D47A1',
					hover: '#0A3D8F',
					foreground: '#FFFFFF'
				},
				tertiary: {
					DEFAULT: '#FFFFFF',
					hover: '#F5F9FF',
					foreground: '#263238'
				},
				destructive: {
					DEFAULT: '#E53935',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#ECEFF1',
					foreground: '#546E7A'
				},
				accent: {
					DEFAULT: '#64B5F6',
					foreground: '#0D47A1'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: '#0D47A1',
					foreground: '#FFFFFF',
					primary: '#64B5F6',
					'primary-foreground': '#FFFFFF',
					accent: '#1E88E5',
					'accent-foreground': '#FFFFFF',
					border: '#1E88E5',
					ring: '#64B5F6'
				},
				success: '#26A69A',
				warning: '#FFA000',
				error: '#E53935',
				info: '#29B6F6'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					"0%": {
						opacity: "0",
						transform: "translateY(10px)"
					},
					"100%": {
						opacity: "1",
						transform: "translateY(0)"
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			},
			boxShadow: {
				'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
				'card-hover': '0 6px 16px rgba(0, 0, 0, 0.12)'
			},
			transitionDuration: {
				'300': '300ms'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, #1E88E5 0%, #0D47A1 100%)',
				'gradient-light': 'linear-gradient(135deg, #64B5F6 0%, #1E88E5 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
