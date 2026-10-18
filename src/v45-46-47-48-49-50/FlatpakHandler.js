import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { CommandExecutor } from './CommandExecutor.js';

export class FlatpakHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('flatpak run') || desktopFile.includes('flatpak') || desktopId.includes('.flatpak.');
    }

    static uninstall(app, appInfo, desktopFile) {
        const flatpakId = appInfo.get_id().replace('.desktop', '');
        const userFlatpakDirectory = GLib.build_filenamev([
            GLib.get_user_data_dir(),
            'flatpak',
        ]);
        const isUserInstallation = desktopFile === userFlatpakDirectory ||
            desktopFile.startsWith(`${userFlatpakDirectory}/`);
        const installationFlag = isUserInstallation ? '--user' : '--system';
        const uninstallCmd = [
            'flatpak',
            'uninstall',
            installationFlag,
            '-y',
            flatpakId,
        ];
        Main.notify(_('Uninstalling Flatpak: %s').format(app.get_name()),
            _('Command: %s').format(uninstallCmd.join(' ')));

        if (isUserInstallation)
            CommandExecutor.execute(uninstallCmd);
        else
            CommandExecutor.executePolkit(uninstallCmd);
    }
}
