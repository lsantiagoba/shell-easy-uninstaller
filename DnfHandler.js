import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { CommandExecutor } from './CommandExecutor.js';

export class DnfHandler {
    static uninstall(app, desktopFile, desktopId) {
        const fallbackPkgName = desktopId.replace('.desktop', '').toLowerCase();

        if (!desktopFile) {
            this._uninstallPackage(app, fallbackPkgName);
            return;
        }

        try {
            const proc = Gio.Subprocess.new(
                ['rpm', '-qf', desktopFile],
                Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            );

            proc.communicate_utf8_async(null, null, (source, result) => {
                let pkgName = fallbackPkgName;

                try {
                    const [, stdout] = source.communicate_utf8_finish(result);

                    if (source.get_successful()) {
                        const matched = stdout.trim();
                        if (matched && !matched.includes('is not owned by any package')) {
                            pkgName = matched;
                        }
                    }
                } catch (e) {
                    logError(e, 'Failed to resolve dnf package with rpm -qf');
                }

                this._uninstallPackage(app, pkgName);
            });
        } catch (e) {
            logError(e, 'Failed to launch rpm package lookup');
            this._uninstallPackage(app, fallbackPkgName);
        }
    }

    static _uninstallPackage(app, pkgName) {
        const uninstallCmd = ['dnf', 'remove', '-y', pkgName];
        Main.notify(_('Uninstalling RPM: %s').format(app.get_name()),
            _('Command: %s').format(`dnf remove ${pkgName}`));
        CommandExecutor.executePolkit(uninstallCmd);
    }
}
