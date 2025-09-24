import { grey, green, indigo } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

// نظام الألوان الجديد الشامل
const newColors = {
  // الخلفيات الأساسية
  backgroundGradientStart: '#1a1f2e',    // بداية التدرج الأساسي
  backgroundGradientEnd: '#2A2F3C',      // نهاية التدرج الأساسي
  backgroundMain: '#2A2F3C',             // الخلفية الرئيسية
  backgroundContent: '#383D4C',          // خلفية المحتوى والقسم الأيسر
  
  // الألوان الأساسية
  primaryBlue: '#3A86FF',                // الأزرق الأساسي
  primaryBlueDark: '#2563EB',            // الأزرق الداكن للتفاعل
  textPrimary: '#FFFFFF',                // النص الأبيض الأساسي
  textSecondary: '#A9B4C2',              // النص الثانوي الرمادي الفاتح
  
  // ألوان الحالات
  errorRed: '#EF4444',                   // الأحمر للأخطاء
  greyDisabled: '#6B7280',               // الرمادي للعناصر المعطلة
  greyLight: '#9CA3AF',                  // الرمادي الفاتح
  
  // ألوان الشفافية للتأثيرات
  whiteTransparent5: 'rgba(255, 255, 255, 0.05)',   // شفاف أبيض 5%
  whiteTransparent8: 'rgba(255, 255, 255, 0.08)',   // شفاف أبيض 8%
  whiteTransparent12: 'rgba(255, 255, 255, 0.12)',  // شفاف أبيض 12%
  blueTransparent10: 'rgba(58, 134, 255, 0.1)',     // شفاف أزرق 10%
  blueTransparent20: 'rgba(58, 134, 255, 0.2)',     // شفاف أزرق 20%
  blueTransparent30: 'rgba(58, 134, 255, 0.3)',     // شفاف أزرق 30%
  blueTransparent50: 'rgba(58, 134, 255, 0.5)',     // شفاف أزرق 50%
  borderTransparent30: 'rgba(169, 180, 194, 0.3)',  // حدود شفافة
  
  // ألوان الجداول والبيانات
  tableHeader: '#454B5B',                // خلفية رأس الجدول
  tableHover: '#4F566B',                 // لون الصف عند مرور الماوس
  tableBorder: '#4A5061',                // الحدود والفواصل بين الخلايا
};

export default (server, darkMode) => ({
  mode: 'dark', // فرض الوضع المظلم دائماً
  background: {
    default: newColors.backgroundMain,
    paper: newColors.backgroundContent,
    gradient: `linear-gradient(135deg, ${newColors.backgroundGradientStart}, ${newColors.backgroundGradientEnd})`,
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || newColors.primaryBlue,
    dark: newColors.primaryBlueDark,
    light: newColors.blueTransparent50,
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || newColors.textSecondary,
  },
  error: {
    main: newColors.errorRed,
  },
  text: {
    primary: newColors.textPrimary,
    secondary: newColors.textSecondary,
    disabled: newColors.greyLight,
  },
  neutral: {
    main: newColors.textSecondary,
  },
  geometry: {
    main: newColors.primaryBlue,
  },
  alwaysDark: {
    main: newColors.backgroundMain,
  },
  // ألوان مخصصة للجداول
  table: {
    header: newColors.tableHeader,
    hover: newColors.tableHover,
    border: newColors.tableBorder,
    striped: {
      primary: newColors.backgroundContent,
      secondary: newColors.backgroundMain,
    },
  },
  // ألوان إضافية للمكونات
  divider: newColors.tableBorder,
  action: {
    hover: newColors.tableHover,
    selected: newColors.tableHover,
    disabled: newColors.greyDisabled,
  },
  // ألوان مخصصة للتصميم الجديد
  custom: {
    // خلفيات
    backgroundGradient: `linear-gradient(135deg, ${newColors.backgroundGradientStart}, ${newColors.backgroundGradientEnd})`,
    backgroundContent: newColors.backgroundContent,
    
    // ألوان التفاعل
    primaryBlue: newColors.primaryBlue,
    primaryBlueDark: newColors.primaryBlueDark,
    
    // ألوان الشفافية
    whiteTransparent5: newColors.whiteTransparent5,
    whiteTransparent8: newColors.whiteTransparent8,
    whiteTransparent12: newColors.whiteTransparent12,
    blueTransparent30: newColors.blueTransparent30,
    blueTransparent50: newColors.blueTransparent50,
    borderTransparent30: newColors.borderTransparent30,
    
    // ألوان الحالات
    errorRed: newColors.errorRed,
    greyDisabled: newColors.greyDisabled,
    greyLight: newColors.greyLight,
  },
});
