const apiUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3030'
    : 'https://api-stats.luckywoman.com.co/';

export default {
  navTheme: 'dark',
  primaryColor: '#1890FF',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'eCommerce Pro',
  pwa: false,
  iconfontUrl: '',
  apiUrl,
};
