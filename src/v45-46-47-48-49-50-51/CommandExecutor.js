import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export class CommandExecutor {
    static execute(cmdArgs) {
        this._execute(cmdArgs);
    }

    static executePolkit(cmdArgs) {
        this._execute(['pkexec'].concat(cmdArgs));
    }

    static _execute(cmdArgs) {
        try {
            const proc = Gio.Subprocess.new(
                cmdArgs,
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
