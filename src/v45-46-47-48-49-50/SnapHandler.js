import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export class SnapHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('snap run') || desktopFile.includes('/snapd/desktop/') || desktopId.startsWith('snap.');
    }

    static resolve(app, appInfo, desktopFile, desktopId) {
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
        
        if (!snapName) {
            Main.notifyError(_('Shell Easy Uninstaller'),
                _('Could not determine Snap name for %s').format(app.get_name()));
            return null;
        }

        return {
            title: _('Uninstalling Snap: %s').format(app.get_name()),
            typeLabel: 'Snap',
            packageName: snapName,
            supportsPurge: true,
            // --purge skips the automatic snapshot of the snap's data.
            commands: purge => [{
                argv: ['snap', 'remove', ...(purge ? ['--purge'] : []), snapName],
                polkit: true,
            }],
        };
    }
}
