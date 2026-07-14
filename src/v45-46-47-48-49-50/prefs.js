import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import { _t, translator } from './translations.js';

const LANGUAGES = [
    ['auto', null],
    ['en', 'English'], ['es', 'Español'], ['fr', 'Français'],
    ['de', 'Deutsch'], ['it', 'Italiano'], ['pt', 'Português'],
    ['zh', '中文'], ['ru', 'Русский'], ['ja', '日本語'],
    ['ko', '한국어'], ['ar', 'العربية'],
];

export default class EasyUninstallerPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        translator.setLanguage(settings.get_string('language'));
        const page = new Adw.PreferencesPage({
            title: _t('settingsTitle'),
            icon_name: 'preferences-system-symbolic',
        });
        const group = new Adw.PreferencesGroup({
            title: _t('languageTitle'),
            description: _t('languageDescription'),
        });
        const languageModel = Gtk.StringList.new(this._languageLabels());
        const languageRow = new Adw.ComboRow({
            title: _t('displayLanguage'),
            model: languageModel,
        });

        const current = LANGUAGES.findIndex(([code]) => code === settings.get_string('language'));
        languageRow.selected = current >= 0 ? current : 0;
        languageRow.connect('notify::selected', row => {
            if (row.selected >= LANGUAGES.length)
                return;

            const language = LANGUAGES[row.selected][0];
            if (settings.get_string('language') !== language)
                settings.set_string('language', language);

            translator.setLanguage(language);
            page.title = _t('settingsTitle');
            group.title = _t('languageTitle');
            group.description = _t('languageDescription');
            languageRow.title = _t('displayLanguage');
        });

        group.add(languageRow);
        page.add(group);
        window.add(page);
    }

    _languageLabels() {
        return LANGUAGES.map(([code, label]) =>
            code === 'auto' ? _t('automaticLanguage') : label);
    }
}
