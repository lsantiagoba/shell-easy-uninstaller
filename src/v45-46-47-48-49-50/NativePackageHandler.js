import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

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
        supportsPurge: true,
        removeCmd: (pkg, purge) => hasProgram('apt-get')
            ? ['apt-get', purge ? 'purge' : 'remove', '-y', pkg]
            : ['dpkg', purge ? '--purge' : '--remove', pkg],
    },
    {
        // Fedora, RHEL, CentOS, openSUSE, Fedora Atomic (Silverblue)...
        name: 'rpm',
        queryCmd: file => ['rpm', '-qf', '--queryformat', '%{NAME}\\n', file],
        parse: stdout => firstLine(stdout),
        // RPM keeps modified configuration files as .rpmsave and none of
        // its front-ends offer a purge mode.
        supportsPurge: false,
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
        supportsPurge: true,
        // -n also removes backup configuration files (.pacsave).
        removeCmd: (pkg, purge) => ['pacman', purge ? '-Rn' : '-R', '--noconfirm', pkg],
    },
];

export class NativePackageHandler {
    // Resolves to an uninstall plan, or to null after notifying the user.
    static resolve(app, desktopFile) {
        const backends = BACKENDS.filter(backend => hasProgram(backend.name));

        if (backends.length === 0) {
            Main.notifyError(_('Shell Easy Uninstaller'),
                _('No supported package manager was found to uninstall %s').format(app.get_name()));
            return Promise.resolve(null);
        }

        if (!desktopFile) {
            this._notifyUnknownPackage(app);
            return Promise.resolve(null);
        }

        return this._resolve(app, desktopFile, backends);
    }

    static async _resolve(app, desktopFile, backends) {
        for (const backend of backends) {
            const pkgName = await this._queryOwner(backend, desktopFile);
            if (pkgName)
                return this._buildPlan(app, backend, pkgName);
        }

        this._notifyUnknownPackage(app);
        return null;
    }

    static _queryOwner(backend, desktopFile) {
        return new Promise(resolve => {
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

                    resolve(pkgName);
                });
            } catch (e) {
                logError(e, `Failed to launch ${backend.name} package lookup`);
                resolve('');
            }
        });
    }

    static _buildPlan(app, backend, pkgName) {
        const manager = backend.removeCmd(pkgName, false)[0];

        return {
            title: _('Uninstalling package: %s').format(app.get_name()),
            typeLabel: _('System package (%s)').format(manager),
            packageName: pkgName,
            supportsPurge: backend.supportsPurge,
            commands: purge => [{
                argv: backend.removeCmd(pkgName, purge && backend.supportsPurge),
                polkit: true,
            }],
        };
    }

    static _notifyUnknownPackage(app) {
        Main.notifyError(_('Shell Easy Uninstaller'),
            _('Could not determine the package that provides %s').format(app.get_name()));
    }
}
