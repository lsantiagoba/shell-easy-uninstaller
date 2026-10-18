import GLib from 'gi://GLib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

export class FlatpakHandler {
    static match(appInfo, desktopFile, desktopId) {
        const commandLine = appInfo.get_commandline() || "";
        return commandLine.includes('flatpak run') || desktopFile.includes('flatpak') || desktopId.includes('.flatpak.');
    }

    static resolve(app, appInfo, desktopFile) {
        const flatpakId = appInfo.get_id().replace('.desktop', '');
        const userFlatpakDirectory = GLib.build_filenamev([
            GLib.get_user_data_dir(),
            'flatpak',
        ]);
        const isUserInstallation = desktopFile === userFlatpakDirectory ||
            desktopFile.startsWith(`${userFlatpakDirectory}/`);
        const installationFlag = isUserInstallation ? '--user' : '--system';

        return {
            title: _('Uninstalling Flatpak: %s').format(app.get_name()),
            typeLabel: 'Flatpak',
            packageName: flatpakId,
            supportsPurge: true,
            commands: purge => {
                const uninstallCmd = ['flatpak', 'uninstall', installationFlag, '-y'];

                // --delete-data removes ~/.var/app/<id> of the user running
                // flatpak, which is root for system installs run via pkexec.
                if (purge && isUserInstallation)
                    uninstallCmd.push('--delete-data');
                uninstallCmd.push(flatpakId);

                const steps = [{argv: uninstallCmd, polkit: !isUserInstallation}];
                if (purge && !isUserInstallation) {
                    const dataDirectory = GLib.build_filenamev([
                        GLib.get_home_dir(), '.var', 'app', flatpakId,
                    ]);
                    steps.push({argv: ['rm', '-rf', '--', dataDirectory], polkit: false});
                }
                return steps;
            },
        };
    }
}
