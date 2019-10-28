export const environment = {
  production: true,
  debug: false,
  pollInterval: 500,
  filesPollInterval: 5000,
  moveToOriginCommand: 'G21G91X-67Y107Z-25F2000 \nG10 P0 L20 X0 Y0 Z0 \nG90',
  ejectCommand: 'G21G91Y23F2000 \nG21G91Y-8F2000',
  moveToEjectCommand: 'G21G91Y147.5F2000',
  moveToLoadCommand: 'G21G91Y143F2000',
  changeBitCommand: 'G21G91X-71.5Y107.5F2000'
};
