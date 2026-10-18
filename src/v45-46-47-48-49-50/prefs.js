import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import {
    ExtensionPreferences,
    gettext as _,
} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class ShellEasyUninstallerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup();
        page.add(group);

        const confirmRow = new Adw.SwitchRow({
            title: _('Confirm before uninstalling'),
            subtitle: _('Show a dialog with the package details before removing an app.'),
        });
        settings.bind('confirm-uninstall', confirmRow, 'active',
            Gio.SettingsBindFlags.DEFAULT);
        group.add(confirmRow);

        window.add(page);
    }
}
