import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export class CommandExecutor {
    static executePolkit(cmdArgs) {
        try {
            // Use pkexec to prompt for password and run as root if needed
            let fullCmd = ['pkexec'].concat(cmdArgs);
            
            const proc = Gio.Subprocess.new(
                fullCmd,
                Gio.SubprocessFlags.NONE
            );
            
            proc.wait_check_async(null, (source, result) => {
                try {
                    source.wait_check_finish(result);
                    Main.notify(_('Shell Easy Uninstaller'),
                        _('Uninstallation completed successfully.'));
                } catch (e) {
                    Main.notifyError(_('Shell Easy Uninstaller'),
                        _('Uninstallation failed: %s').format(e.message));
                }
            });
        } catch (e) {
            logError(e, 'Failed to launch uninstall command');
            Main.notifyError(_('Shell Easy Uninstaller'),
                _('Error launching uninstaller: %s').format(e.message));
        }
    }
}
