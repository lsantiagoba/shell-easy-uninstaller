import { AppUninstaller } from './AppUninstaller.js';

export function uninstallApp(app) {
    const uninstaller = new AppUninstaller(app);
    uninstaller.uninstall();
}
