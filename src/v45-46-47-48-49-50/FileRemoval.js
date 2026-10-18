import Gio from 'gi://Gio';
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

// Builds a plan that moves files to the Trash, or deletes them permanently
// when the purge option is selected.
export function buildFileRemovalPlan({title, typeLabel, packageName, details, files}) {
    // Files that cannot be trashed (e.g. under /opt or on a filesystem
    // without a trash) can only be deleted permanently, with elevated
    // privileges when the user is not allowed to delete them.
    const trashable = files.every(path => hasAccess(path, 'access::can-trash'));
    const needsPolkit = !files.every(path => hasAccess(path, 'access::can-delete'));

    return {
        title,
        typeLabel,
        packageName,
        details,
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
