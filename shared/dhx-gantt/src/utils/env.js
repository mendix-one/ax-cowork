import global from './global'

var isWindowAwailable = typeof window !== 'undefined'

export default {
  isIE: isWindowAwailable && (navigator.userAgent.indexOf('MSIE') >= 0 || navigator.userAgent.indexOf('Trident') >= 0),
  isOpera: isWindowAwailable && (navigator.userAgent.indexOf('Opera') >= 0 || navigator.userAgent.indexOf('OPR') >= 0),
  isChrome: isWindowAwailable && navigator.userAgent.indexOf('Chrome') >= 0,
  isSafari: isWindowAwailable && (navigator.userAgent.indexOf('Safari') >= 0 || navigator.userAgent.indexOf('Konqueror') >= 0),
  isFF: isWindowAwailable && navigator.userAgent.indexOf('Firefox') >= 0,
  isIPad: isWindowAwailable && navigator.userAgent.search(/iPad/gi) >= 0,
  isEdge: isWindowAwailable && navigator.userAgent.indexOf('Edge') != -1,
  isNode: !isWindowAwailable || typeof navigator == 'undefined' || (typeof PRODUCTION !== 'undefined' && PRODUCTION === 'test'),
  isSalesforce: isWindowAwailable && (!!global['Sfdc'] || !!global['$A'] || global['Aura']),
}
