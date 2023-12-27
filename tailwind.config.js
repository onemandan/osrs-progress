module.exports = {
    content: [
        './_site/**/*.js',
		'./_site/**/*.html',
		'./_site/*.html'
	],
    theme: {
        extend: {
            transitionProperty: {
                'width': 'width'
            },
            gridTemplateColumns: {
                '24': 'repeat(24, minmax(0, 1fr))'
            },
            colors: {
                'birch': {
                    '50': '#e9e9d8',
                    '100': '#d4d3b4',
                    '200': '#bcb888',
                    '300': '#a8a167',
                    '400': '#998f59',
                    '500': '#554c41',
                    '600': '#6a5c3e',
                    '700': '#5a4d39',
                    '800': '#3E3529',
                    '900': '#2E2921',
                    '950': '#1D1C18',
                },
                'carrot': {
                    '50': '#fff8ed',
                    '100': '#ffefd4',
                    '200': '#ffdba8',
                    '300': '#ffc171',
                    '400': '#ff9933',
                    '500': '#fe7e11',
                    '600': '#ef6307',
                    '700': '#c64808',
                    '800': '#9d3a0f',
                    '900': '#7e3110',
                    '950': '#441606',
                }                                    
            }
        }
    },
    variants: {
        extend: {}
    },
    plugins: [
        require('@tailwindcss/typography')
    ]
}