import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const toArgv = step => step.polkit ? ['pkexec', ...step.argv] : step.argv;

export class CommandExecutor {
    static runPlan(plan, purge) {
        const steps = plan.commands(purge);
        Main.notify(plan.title,
            _('Command: %s').format(steps.map(step => toArgv(step).join(' ')).join(' && ')));
        this._runSteps(steps);
    }

    // Runs each step after the previous one succeeds and reports once at the end.
    static _runSteps([step, ...remaining]) {
        if (!step) {
            Main.notify(_('Shell Easy Uninstaller'),
                _('Uninstallation completed successfully.'));
            return;
        }

        try {
            const proc = Gio.Subprocess.new(
                toArgv(step),
                Gio.SubprocessFlags.NONE
            );
            
            proc.wait_check_async(null, (source, result) => {
                try {
                    source.wait_check_finish(result);
                } catch (e) {
                    Main.notifyError(_('Shell Easy Uninstaller'),
                        _('Uninstallation failed: %s').format(e.message));
                    return;
                }
                this._runSteps(remaining);
            });
        } catch (e) {
            logError(e, 'Failed to launch uninstall command');
            Main.notifyError(_('Shell Easy Uninstaller'),
                _('Error launching uninstaller: %s').format(e.message));
        }
    }
}
