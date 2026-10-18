import { FlatpakHandler } from './FlatpakHandler.js';
import { SnapHandler } from './SnapHandler.js';
import { NativePackageHandler } from './NativePackageHandler.js';

export class AppUninstaller {
    constructor(app) {
        this.app = app;
        this.appInfo = app.get_app_info();
        this.desktopId = app.get_id();
        this.desktopFile = this._getDesktopFile();
    }

    _getDesktopFile() {
        if (this.appInfo.get_filename) {
            return this.appInfo.get_filename() || "";
        }
        return "";
    }

    uninstall() {
        if (FlatpakHandler.match(this.appInfo, this.desktopFile, this.desktopId)) {
            FlatpakHandler.uninstall(this.app, this.appInfo, this.desktopFile);
        } else if (SnapHandler.match(this.appInfo, this.desktopFile, this.desktopId)) {
            SnapHandler.uninstall(this.app, this.appInfo, this.desktopFile, this.desktopId);
        } else {
            // Fallback to the system package manager (apt, dnf, zypper, pacman...)
            NativePackageHandler.uninstall(this.app, this.desktopFile);
        }
    }
}
