// LOLPOP FILE This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,		
  debug: true,
  pollInterval: 500,
  filesPollInterval: 5000,
  moveToOriginCommand: 'G21G91X-72.5Y109.5Z-6F2000 \nG10 P0 L20 X0 Y0 Z0 \nG90',
  ejectCommand: 'G21G91Y38.5F2000 \nG4 P4 \nG21G91Y-4F2000',
  moveToEjectCommand: 'G21G91Y147.5F2000',
  moveToLoadCommand: 'G21G91Y143F2000',
  changeBitCommand: 'G21G91X-71.5Y107.5F2000'

};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
