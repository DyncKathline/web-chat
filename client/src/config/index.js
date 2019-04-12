const isLocal = window.location.href.indexOf('debug') !== -1 || false;

export default {
  server: (process.env.NODE_ENV === 'development' || isLocal ) ? 'localhost:9090/' : '//www.qiufengh.com/',
}