/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(255,71,66,.9)',
          light: '#fff',
          dark: '#1E40AF',
          redLight: 'rgb(255,103,103)',
          redLight_fade: 'rgba(255,103,103,.55)',
          menuBtnHover: 'rgba(255,229,225,.45)',
        },
        secondary: {
          DEFAULT: 'rgb(0,71,237,.6)',
          lavender_fade: 'rgba(207,206,255,.35)',
          male: '#2daae2',
          female: '#e71873',
        },
        charts: {
          lineChart: {
            lineColor_A: 'rgb(255,103,103)',
            lineColor_B: 'rgb(0,144,205)',
            lineColor_C: 'rgb(135,206,235)',
          },
          pieChart: {},
          barChart: {
            barColor_A: 'rgb(0,144,205)',
            barColor_B: 'rgb(89,188,193)',
            barColor_C: 'rgb(135,206,235)',
          },
        },
        tables: {
          actions: {
            bgViewIcon: 'rgb(156,222,247)',
            bgEditIcon: 'rgb(242,242,242)',
            bgDeleteIcon: 'rgb(156,152,255)',
          },
        },
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      // *Hàm đệ quy để tạo biến CSS cho tất cả các màu
      const createCssVars = (colorObj, prefix = '--color') => {
        return Object.entries(colorObj).reduce((acc, [key, value]) => {
          // *Nếu có DEFAULT, gán trực tiếp cho tên chính (ví dụ --color-primary)
          if (value.DEFAULT) {
            acc[`${prefix}-${key}`] = value.DEFAULT;
          }
          if (typeof value === 'object') {
            // *Nếu giá trị là object, gọi đệ quy để xử lý tiếp
            Object.assign(acc, createCssVars(value, `${prefix}-${key}`));
          } else {
            acc[`${prefix}-${key}`] = value;
          }
          return acc;
        }, {});
      };

      // *Lấy tất cả màu từ config
      const allColors = theme('colors');
      const cssVars = createCssVars(allColors);

      // *Thêm vào :root
      addBase({
        ':root': cssVars,
      });
    },
  ],
};
