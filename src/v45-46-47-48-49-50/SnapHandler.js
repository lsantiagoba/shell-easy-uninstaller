import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { CommandExecutor } from './CommandExecutor.js';
import { _t } from './translations.js';

export class SnapHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('snap run') || desktopFile.includes('/snapd/desktop/') || desktopId.startsWith('snap.');
    }

    static uninstall(app, appInfo, desktopFile, desktopId) {
        let snapName = "";
        const commandLine = appInfo.get_commandline() || "";
        
        if (desktopFile.includes('/snapd/desktop/')) {
            // Path: /var/lib/snapd/desktop/applications/snapname_appname.desktop
            const parts = desktopId.split('_');
            if (parts.length > 0) snapName = parts[0];
        } else if (desktopId.startsWith('snap.')) {
            // Path: snap.snapname.appname.desktop
            const parts = desktopId.split('.');
            if (parts.length > 1) snapName = parts[1];
        } else if (commandLine.includes('snap run')) {
            const match = commandLine.match(/snap run ([^\s]+)/);
            if (match && match[1]) snapName = match[1];
        } else {
            // Fallback
            snapName = desktopId.split('_')[0].split('.')[0];
        }
        
        if (snapName) {
            const uninstallCmd = ['snap', 'remove', snapName];
            Main.notify(_t('uninstallingSnap', app.get_name()), _t('command', uninstallCmd.join(' ')));
            CommandExecutor.executePolkit(uninstallCmd);
        } else {
            Main.notifyError(_t('appName'), _t('couldNotDetermineSnap', app.get_name()));
        }
    }
}
