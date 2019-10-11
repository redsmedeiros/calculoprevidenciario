// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://api.calculos.ieprev.com.br/',
  // authUrl: 'https://codificar.ieprev.com.br/verificatoken/',
  // loginPageUrl: 'https://codificar.ieprev.com.br/auth/loginPanel',


  // local
  apiUrl: 'http://localhost:8000/',
  authUrl: 'http://localhost:8080/ieprev/verificatoken/',
  loginPageUrl: 'http://localhost:8080/ieprev/auth/loginPanel',


  // homologacao
  // apiUrl: 'http://api.calculos.homologacao.ieprev.com.br/',
  // authUrl: 'http://teste.ieprev.com.br/verificatoken/',
  // loginPageUrl: 'http://teste.ieprev.com.br/auth/loginPanel',
};
