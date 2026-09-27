import GLib from 'gi://GLib';
import { FlatpakHandler } from './FlatpakHandler.js';
import { SnapHandler } from './SnapHandler.js';
import { DebAptHandler } from './DebAptHandler.js';
import { DnfHandler } from './DnfHandler.js';

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
            // Check if dnf is available, otherwise fallback to apt
            if (GLib.find_program_in_path('dnf')) {
                DnfHandler.uninstall(this.app, this.desktopFile, this.desktopId);
            } else {
                DebAptHandler.uninstall(this.app, this.desktopFile, this.desktopId);
            }
        }
    }
}
