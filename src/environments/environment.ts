// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost',
  //apiURL: 'http://192.168.100.5',
  apiPort: 3000,
  eventURL: 'ws://localhost',
  //eventURL: 'ws://192.168.100.5',
  eventPort: 3000,
  gmaApiURL: 'http://localhost',
  gmaApiPort: 3003,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.