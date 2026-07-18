import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { CommandExecutor } from './CommandExecutor.js';

export class FlatpakHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('flatpak run') || desktopFile.includes('flatpak') || desktopId.includes('.flatpak.');
    }

    static uninstall(app, appInfo) {
        const flatpakId = appInfo.get_id().replace('.desktop', '');
        const uninstallCmd = ['flatpak', 'uninstall', '-y', flatpakId];
        Main.notify(_('Uninstalling Flatpak: %s').format(app.get_name()),
            _('Command: %s').format(uninstallCmd.join(' ')));
        CommandExecutor.executePolkit(uninstallCmd);
    }
}
