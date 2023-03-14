export const environment = {
  stg: {
    authUrl: 'https://iqstgauth.certua.io/oauth/token?grant_type=client_credentials',
    openBankingElementsUrl:
      'https://cdn.certua.io/ux-micro-frontends/open-banking-elements/stg/{version}',
    daasElementsUrl:
      'https://cdn.certua.io/ux-elements/daas-elements/stg/{version}/certua-daas.es6.js'
  },
  qa: {
    authUrl: 'https://iqqaauth.certua.io/oauth/token?grant_type=client_credentials',
    openBankingElementsUrl:
      'https://cdn.certua.io/ux-micro-frontends/open-banking-elements/qa/current',
    daasElementsUrl: 'https://cdn.certua.io/ux-elements/daas-elements/qa/current/certua-daas.es6.js'
  },
  dev: {
    authUrl: 'https://iqdevauth.certua.io/oauth/token?grant_type=client_credentials',
    openBankingElementsUrl:
      'https://cdn.certua.io/ux-micro-frontends/open-banking-elements/dev/current',
    daasElementsUrl:
      'https://cdn.certua.io/ux-elements/daas-elements/dev/current/certua-daas.es6.js'
  },
  local: {
    authUrl: 'https://iqdevauth.certua.io/oauth/token?grant_type=client_credentials',
    openBankingElementsUrl: 'http://localhost:4208',
    daasElementsUrl: 'http://localhost:5501/lib/certua-daas.es6.js'
  }
}
