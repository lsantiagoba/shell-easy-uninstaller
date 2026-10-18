import { AppImageHandler } from './AppImageHandler.js';
import { CustomShortcutHandler } from './CustomShortcutHandler.js';
import { FlatpakHandler } from './FlatpakHandler.js';
import { SnapHandler } from './SnapHandler.js';
import { NativePackageHandler } from './NativePackageHandler.js';

// An uninstall plan describes what will be removed before anything runs:
//   title         notification title shown when the uninstall starts
//   typeLabel     human readable package type (Flatpak, Snap, ...)
//   packageName   identifier passed to the package manager, or null
//   details       optional extra lines shown in the confirmation dialog
//   supportsPurge whether configuration files can be removed too
//   purgeLabel    optional label for the purge option
//   purgeForced   optional, the purge option is always applied
//   commands      purge => [{argv, polkit}] steps run in order
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

    // Resolves to an uninstall plan, or to null when the app cannot be
    // uninstalled (the handler has already notified the user).
    async resolve() {
        const appImagePath = AppImageHandler.findAppImage(this.appInfo);
        if (appImagePath)
            return AppImageHandler.resolve(this.app, appImagePath, this.desktopFile);
        if (FlatpakHandler.match(this.appInfo, this.desktopFile, this.desktopId))
            return FlatpakHandler.resolve(this.app, this.appInfo, this.desktopFile);
        if (SnapHandler.match(this.appInfo, this.desktopFile, this.desktopId))
            return SnapHandler.resolve(this.app, this.appInfo, this.desktopFile, this.desktopId);
        // Launchers in ~/.local/share/applications are never owned by a package.
        if (CustomShortcutHandler.match(this.desktopFile))
            return CustomShortcutHandler.resolve(this.app, this.desktopFile);
        // Fallback to the system package manager (apt, dnf, zypper, pacman...)
        return NativePackageHandler.resolve(this.app, this.desktopFile);
    }
}
