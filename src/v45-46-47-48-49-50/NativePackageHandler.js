import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { CommandExecutor } from './CommandExecutor.js';

const hasProgram = program => GLib.find_program_in_path(program) !== null;

const firstLine = text => (text || '').split('\n')[0].trim();

// Each backend resolves which package owns a file and builds the command
// that removes it. Backends are tried in order until one claims the file.
const BACKENDS = [
    {
        // Debian, Ubuntu, Linux Mint, Pop!_OS...
        name: 'dpkg',
        queryCmd: file => ['dpkg', '-S', file],
        parse: stdout => {
            // Output format: package-name: /path/to/file. Splitting on
            // `: ` preserves architecture-qualified names such as pkg:amd64.
            const line = firstLine(stdout);
            const separator = line.indexOf(': ');
            return separator >= 0 ? line.slice(0, separator).split(', ')[0].trim() : '';
        },
        removeCmd: pkg => hasProgram('apt-get')
            ? ['apt-get', 'remove', '-y', pkg]
            : ['dpkg', '--remove', pkg],
    },
    {
        // Fedora, RHEL, CentOS, openSUSE, Fedora Atomic (Silverblue)...
        name: 'rpm',
        queryCmd: file => ['rpm', '-qf', '--queryformat', '%{NAME}\\n', file],
        parse: stdout => firstLine(stdout),
        removeCmd: pkg => {
            if (GLib.file_test('/run/ostree-booted', GLib.FileTest.EXISTS) && hasProgram('rpm-ostree'))
                return ['rpm-ostree', 'uninstall', pkg];
            if (hasProgram('dnf'))
                return ['dnf', 'remove', '-y', pkg];
            if (hasProgram('zypper'))
                return ['zypper', '--non-interactive', 'remove', pkg];
            if (hasProgram('yum'))
                return ['yum', 'remove', '-y', pkg];
            return ['rpm', '-e', pkg];
        },
    },
    {
        // Arch Linux, Manjaro, EndeavourOS...
        name: 'pacman',
        queryCmd: file => ['pacman', '-Qqo', file],
        parse: stdout => firstLine(stdout),
        removeCmd: pkg => ['pacman', '-R', '--noconfirm', pkg],
    },
];

export class NativePackageHandler {
    static uninstall(app, desktopFile) {
        const backends = BACKENDS.filter(backend => hasProgram(backend.name));

        if (backends.length === 0) {
            Main.notifyError(_('Shell Easy Uninstaller'),
                _('No supported package manager was found to uninstall %s').format(app.get_name()));
            return;
        }

        if (!desktopFile) {
            this._notifyUnknownPackage(app);
            return;
        }

        this._resolve(app, desktopFile, backends);
    }

    static _resolve(app, desktopFile, backends) {
        const [backend, ...remaining] = backends;

        if (!backend) {
            this._notifyUnknownPackage(app);
            return;
        }

        const tryNext = () => this._resolve(app, desktopFile, remaining);

        try {
            const proc = Gio.Subprocess.new(
                backend.queryCmd(desktopFile),
                Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
            );

            proc.communicate_utf8_async(null, null, (source, result) => {
                let pkgName = '';

                try {
                    const [, stdout] = source.communicate_utf8_finish(result);
                    if (source.get_successful())
                        pkgName = backend.parse(stdout);
                } catch (e) {
                    logError(e, `Failed to resolve package with ${backend.name}`);
                }

                if (pkgName)
                    this._uninstallPackage(app, backend.removeCmd(pkgName));
                else
                    tryNext();
            });
        } catch (e) {
            logError(e, `Failed to launch ${backend.name} package lookup`);
            tryNext();
        }
    }

    static _uninstallPackage(app, uninstallCmd) {
        Main.notify(_('Uninstalling package: %s').format(app.get_name()),
            _('Command: %s').format(uninstallCmd.join(' ')));
        CommandExecutor.executePolkit(uninstallCmd);
    }

    static _notifyUnknownPackage(app) {
        Main.notifyError(_('Shell Easy Uninstaller'),
            _('Could not determine the package that provides %s').format(app.get_name()));
    }
}
