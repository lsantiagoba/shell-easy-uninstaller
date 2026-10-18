import GLib from 'gi://GLib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import { buildFileRemovalPlan } from './FileRemoval.js';

// AppImages are single files, so uninstalling one means removing the
// AppImage and the .desktop launcher that points to it.
export class AppImageHandler {
    // Returns the path of the AppImage referenced by the Exec= line, or null.
    static findAppImage(appInfo) {
        let argv;
        try {
            [, argv] = GLib.shell_parse_argv(appInfo.get_commandline() || '');
        } catch (e) {
            return null;
        }

        // The AppImage is not always argv[0], e.g. `env VAR=1 /path/App.AppImage %U`.
        const path = argv.find(arg => arg.toLowerCase().endsWith('.appimage'));
        if (!path || !GLib.path_is_absolute(path) ||
            !GLib.file_test(path, GLib.FileTest.IS_REGULAR))
            return null;
        return path;
    }

    static resolve(app, appImagePath, desktopFile) {
        const files = [appImagePath];
        if (desktopFile)
            files.push(desktopFile);

        return buildFileRemovalPlan({
            title: _('Uninstalling AppImage: %s').format(app.get_name()),
            typeLabel: 'AppImage',
            packageName: appImagePath,
            details: desktopFile ? [_('Launcher: %s').format(desktopFile)] : [],
            files,
        });
    }
}
