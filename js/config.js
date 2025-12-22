tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: { 
                    gold: '#c5a059', 
                    'gold-light': '#e6c88a',
                    dark: '#1a1c23', 
                    'dark-lighter': '#252830', 
                    'dark-accent': '#2d313a',
                    paper: '#f9f7f2', 
                    'paper-dark': '#f0ede6',
                    dim: 'rgba(0,0,0,0.5)'
                }
            },
            fontFamily: {
                'serif': ['"Libre Baskerville"', 'serif'],
                'display': ['"Cinzel"', 'serif'],
                'arabic': ['"Amiri"', 'serif'],
                'sans': ['"Inter"', 'sans-serif']
            },
            backgroundImage: {
                'grain': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                'islamic': "url('https://www.transparenttextures.com/patterns/arabesque.png')",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                'glow': '0 0 15px rgba(197, 160, 89, 0.3)',
                'card': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
                'inner-light': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3)'
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-in-right': 'slideInRight 0.4s ease-out',
                'pulse-slow': 'pulse 3s infinite',
                'float': 'float 6s ease-in-out infinite'
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
                float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } }
            }
        }
    }
}