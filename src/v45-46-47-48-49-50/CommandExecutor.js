import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { _t } from './translations.js';

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
                    Main.notify(_t('appName'), _t('uninstallCompleted'));
                } catch (e) {
                    Main.notifyError(_t('appName'), _t('uninstallFailed', e.message));
                }
            });
        } catch (e) {
            logError(e, 'Failed to launch uninstall command');
            Main.notifyError(_t('appName'), _t('errorLaunching', e.message));
        }
    }
}
