import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { CommandExecutor } from './CommandExecutor.js';
import { _t } from './translations.js';

export class FlatpakHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('flatpak run') || desktopFile.includes('flatpak') || desktopId.includes('.flatpak.');
    }

    static uninstall(app, appInfo) {
        const flatpakId = appInfo.get_id().replace('.desktop', '');
        const uninstallCmd = ['flatpak', 'uninstall', '-y', flatpakId];
        Main.notify(_t('uninstallingFlatpak', app.get_name()), _t('command', uninstallCmd.join(' ')));
        CommandExecutor.executePolkit(uninstallCmd);
    }
}
