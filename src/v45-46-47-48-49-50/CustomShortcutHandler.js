import GLib from 'gi://GLib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { buildFileRemovalPlan } from './FileRemoval.js';

// A launcher the user created in ~/.local/share/applications that does not
// belong to any package. Uninstalling it only removes the .desktop file.
export class CustomShortcutHandler {
    static match(desktopFile) {
        const userApplicationsDirectory = GLib.build_filenamev([
            GLib.get_user_data_dir(),
            'applications',
        ]);
        return desktopFile.startsWith(`${userApplicationsDirectory}/`);
    }

    static resolve(app, desktopFile) {
        return buildFileRemovalPlan({
            title: _('Removing shortcut: %s').format(app.get_name()),
            typeLabel: _('Custom shortcut'),
            packageName: null,
            details: [_('Launcher: %s').format(desktopFile)],
            files: [desktopFile],
        });
    }
}
