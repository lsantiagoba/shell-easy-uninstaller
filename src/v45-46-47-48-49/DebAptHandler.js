import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { CommandExecutor } from './CommandExecutor.js';
import { _t } from './translations.js';

export class DebAptHandler {
    static uninstall(app, desktopFile, desktopId) {
        let pkgName = "";
        
        if (desktopFile) {
            try {
                // Find package name using dpkg -S
                const [success, stdout, stderr, exitStatus] = GLib.spawn_command_line_sync(`dpkg -S "${desktopFile}"`);
                if (success && exitStatus === 0) {
                    const output = new TextDecoder().decode(stdout);
                    // Output format: package-name: /path/to/file
                    const matched = output.split(':')[0];
                    if (matched) {
                        pkgName = matched.trim();
                    }
                }
            } catch (e) {
                logError(e, 'Failed to resolve deb package with dpkg -S');
            }
        }
        
        // Fallback if dpkg -S fails
        if (!pkgName) {
            pkgName = desktopId.replace('.desktop', '').toLowerCase();
        }
        
        const uninstallCmd = ['apt-get', 'remove', '-y', pkgName];
        Main.notify(_t('uninstallingDeb', app.get_name()), _t('command', `apt-get remove ${pkgName}`));
        CommandExecutor.executePolkit(uninstallCmd);
    }
}
