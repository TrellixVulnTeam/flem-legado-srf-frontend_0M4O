// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,
  baseUrl: 'http://srfapi.flem.org.br/',
  // baseUrl: 'http://localhost:8082/frequenciaAPI/',
  // baseUrl: 'http://10.33.0.58:8086/',
  // urlToken: 'http://authapi.boaviagem.flem.org.br/oauth/token',
  // urlUser: 'http://authapi.boaviagem.flem.org.br/user',
  urlToken: 'http://authapi.flem.org.br/oauth/token',
  urlUser: 'http://authapi.flem.org.br/user',
  
};

