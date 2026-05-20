import global from './global'

/* eslint-disable no-restricted-globals */
var isWindowAwailable = typeof window !== 'undefined'

/* eslint-enable no-restricted-globals */

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
