
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
			fontFamily: {
				'knewave': ['Knewave', 'cursive'],
				'poppins': ['Poppins', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
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
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Cores das turmas
				'turma-azul': '#5dade2',
				'turma-amarelo': '#f1c40f',
				'turma-branco': '#ecf0f1',
				'turma-vermelho': '#e74c3c',
				'turma-verde': '#2ecc71',
				'turma-laranja': '#e67e22',
				'turma-rosa': '#ff69b4',
				'turma-roxo': '#9b59b6',
				'turma-violeta': '#8e44ad',
				'turma-preto': '#bdc3c7',
				'turma-cinza': '#95a5a6',
				'turma-marrom': '#a1887f',
				// Cores dos caracteres
				'char-c': '#e73c7e',
				'char-o': '#ee7752',
				'char-r': '#ffde33',
				'char-e': '#23d5ab',
				'char-s': '#23a6d5',
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
				'gradient-animation': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'pulse-highlight': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.02)' },
					'100%': { transform: 'scale(1)' }
				},
				'rank-up': {
					'0%': { 
						transform: 'translateY(0px)',
						backgroundColor: 'rgba(40, 167, 69, 0.3)'
					},
					'50%': { 
						transform: 'translateY(-5px)',
						backgroundColor: 'rgba(40, 167, 69, 0.5)'
					},
					'100%': { 
						transform: 'translateY(0px)',
						backgroundColor: 'rgba(40, 167, 69, 0.3)'
					}
				},
				'rank-down': {
					'0%': { 
						transform: 'translateY(0px)',
						backgroundColor: 'rgba(220, 53, 69, 0.3)'
					},
					'50%': { 
						transform: 'translateY(5px)',
						backgroundColor: 'rgba(220, 53, 69, 0.5)'
					},
					'100%': { 
						transform: 'translateY(0px)',
						backgroundColor: 'rgba(220, 53, 69, 0.3)'
					}
				},
				'gold-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
						backgroundColor: 'rgba(255, 215, 0, 0.15)'
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
						backgroundColor: 'rgba(255, 215, 0, 0.25)'
					}
				},
				'silver-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px rgba(192, 192, 192, 0.5)',
						backgroundColor: 'rgba(192, 192, 192, 0.15)'
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(192, 192, 192, 0.8)',
						backgroundColor: 'rgba(192, 192, 192, 0.25)'
					}
				},
				'bronze-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px rgba(205, 127, 50, 0.5)',
						backgroundColor: 'rgba(205, 127, 50, 0.15)'
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(205, 127, 50, 0.8)',
						backgroundColor: 'rgba(205, 127, 50, 0.25)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient': 'gradient-animation 20s ease infinite',
				'pulse-highlight': 'pulse-highlight 0.8s ease-in-out',
				'rank-up': 'rank-up 0.8s ease-in-out',
				'rank-down': 'rank-down 0.8s ease-in-out',
				'gold-glow': 'gold-glow 2s ease-in-out infinite',
				'silver-glow': 'silver-glow 2s ease-in-out infinite',
				'bronze-glow': 'bronze-glow 2s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-rainbow': 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab, #ffde33, #e73c7e)'
			},
			backgroundSize: {
				'400': '400% 400%'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
