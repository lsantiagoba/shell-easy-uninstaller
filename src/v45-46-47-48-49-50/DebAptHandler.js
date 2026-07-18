import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { CommandExecutor } from './CommandExecutor.js';

export class DebAptHandler {
    static uninstall(app, desktopFile, desktopId) {
        const fallbackPkgName = desktopId.replace('.desktop', '').toLowerCase();

        if (!desktopFile) {
            this._uninstallPackage(app, fallbackPkgName);
            return;
        }

        try {
            const proc = Gio.Subprocess.new(
                ['dpkg', '-S', desktopFile],
                Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            );

            proc.communicate_utf8_async(null, null, (source, result) => {
                let pkgName = fallbackPkgName;

                try {
                    const [, stdout] = source.communicate_utf8_finish(result);

                    if (source.get_successful()) {
                        // Output format: package-name: /path/to/file. Splitting on
                        // `: ` preserves architecture-qualified names such as pkg:amd64.
                        const separator = stdout.indexOf(': ');
                        const matched = separator >= 0 ? stdout.slice(0, separator) : '';
                        pkgName = matched.trim() || fallbackPkgName;
                    }
                } catch (e) {
                    logError(e, 'Failed to resolve deb package with dpkg -S');
                }

                this._uninstallPackage(app, pkgName);
            });
        } catch (e) {
            logError(e, 'Failed to launch dpkg package lookup');
            this._uninstallPackage(app, fallbackPkgName);
        }
    }

    static _uninstallPackage(app, pkgName) {
        const uninstallCmd = ['apt-get', 'remove', '-y', pkgName];
        Main.notify(_('Uninstalling Deb: %s').format(app.get_name()),
            _('Command: %s').format(`apt-get remove ${pkgName}`));
        CommandExecutor.executePolkit(uninstallCmd);
    }
}
