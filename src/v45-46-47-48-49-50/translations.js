import GLib from 'gi://GLib';

const TRANSLATIONS = {
    en: {
        uninstallCompleted: "Uninstallation completed successfully.",
        uninstallFailed: "Uninstallation failed: {0}",
        errorLaunching: "Error launching uninstaller: {0}",
        uninstallingFlatpak: "Uninstalling Flatpak: {0}",
        uninstallingSnap: "Uninstalling Snap: {0}",
        uninstallingDeb: "Uninstalling Deb: {0}",
        couldNotDetermineSnap: "Could not determine Snap name for {0}",
        command: "Command: {0}",
        uninstallButton: "Uninstall App",
        appName: "Shell Easy Uninstaller"
    },
    es: {
        uninstallCompleted: "Desinstalación completada con éxito.",
        uninstallFailed: "La desinstalación falló: {0}",
        errorLaunching: "Error al iniciar el desinstalador: {0}",
        uninstallingFlatpak: "Desinstalando Flatpak: {0}",
        uninstallingSnap: "Desinstalando Snap: {0}",
        uninstallingDeb: "Desinstalando Deb: {0}",
        couldNotDetermineSnap: "No se pudo determinar el nombre de Snap para {0}",
        command: "Comando: {0}",
        uninstallButton: "Desinstalar aplicación",
        appName: "Shell Easy Uninstaller"
    },
    fr: {
        uninstallCompleted: "Désinstallation terminée avec succès.",
        uninstallFailed: "Échec de la désinstallation : {0}",
        errorLaunching: "Erreur lors du lancement du programme de désinstallation : {0}",
        uninstallingFlatpak: "Désinstallation de Flatpak : {0}",
        uninstallingSnap: "Désinstallation de Snap : {0}",
        uninstallingDeb: "Désinstallation de Deb : {0}",
        couldNotDetermineSnap: "Impossible de déterminer le nom Snap pour {0}",
        command: "Commande : {0}",
        uninstallButton: "Désinstaller l'application",
        appName: "Shell Easy Uninstaller"
    }
};

export class Translator {
    constructor() {
        this.language = this._detectLanguage();
        this.strings = TRANSLATIONS[this.language] || TRANSLATIONS['en'];
    }

    _detectLanguage() {
        // Read language from environment variables
        const envSources = ['LANGUAGE', 'LC_ALL', 'LC_MESSAGES', 'LANG'];
        let locale = 'en';

        for (const env of envSources) {
            const val = GLib.getenv(env);
            if (val) {
                // Typical format: es_ES.UTF-8 -> 'es'
                const lang = val.split('_')[0].split('.')[0].toLowerCase();
                if (TRANSLATIONS[lang]) {
                    locale = lang;
                    break;
                }
            }
        }
        return locale;
    }

    get(key, ...args) {
        let text = this.strings[key];
        if (!text) {
            // Fallback to English if key is missing in chosen language
            text = TRANSLATIONS['en'][key] || key;
        }

        if (args.length > 0) {
            for (let i = 0; i < args.length; i++) {
                text = text.replace(`{${i}}`, args[i]);
            }
        }
        return text;
    }
}

export const translator = new Translator();
export const _t = (key, ...args) => translator.get(key, ...args);
