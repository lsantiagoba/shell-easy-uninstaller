import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

const hasAccess = (path, attribute) => {
    try {
        return Gio.File.new_for_path(path)
            .query_info(attribute, Gio.FileQueryInfoFlags.NONE, null)
            .get_attribute_boolean(attribute);
    } catch (e) {
        return false;
    }
};

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

        // Files that cannot be trashed (e.g. under /opt or on a filesystem
        // without a trash) can only be deleted permanently, with elevated
        // privileges when the user is not allowed to delete them.
        const trashable = files.every(path => hasAccess(path, 'access::can-trash'));
        const needsPolkit = !files.every(path => hasAccess(path, 'access::can-delete'));

        return {
            title: _('Uninstalling AppImage: %s').format(app.get_name()),
            typeLabel: 'AppImage',
            packageName: appImagePath,
            details: desktopFile ? [_('Launcher: %s').format(desktopFile)] : [],
            purgeLabel: trashable
                ? _('Delete permanently instead of moving to Trash')
                : _('Delete permanently (these files cannot be moved to Trash)'),
            supportsPurge: true,
            purgeForced: !trashable,
            commands: purge => purge || !trashable
                ? [{argv: ['rm', '-f', '--', ...files], polkit: needsPolkit}]
                : [{argv: ['gio', 'trash', '--', ...files], polkit: false}],
        };
    }
}
