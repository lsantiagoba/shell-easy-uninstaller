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
        uninstallButton: "Uninstall",
        settingsTitle: "Settings",
        languageTitle: "Language",
        languageDescription: "Choose the language used by the options menu, Uninstall action, and notifications.",
        displayLanguage: "Display language",
        automaticLanguage: "Automatic (system language)",
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
        uninstallButton: "Desinstalar",
        settingsTitle: "Configuración",
        languageTitle: "Idioma",
        languageDescription: "Elige el idioma del menú de opciones, la acción Desinstalar y las notificaciones.",
        displayLanguage: "Idioma de visualización",
        automaticLanguage: "Automático (idioma del sistema)",
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
        uninstallButton: "Désinstaller",
        settingsTitle: "Paramètres",
        languageTitle: "Langue",
        languageDescription: "Choisissez la langue du menu des options, de l’action Désinstaller et des notifications.",
        displayLanguage: "Langue d’affichage",
        automaticLanguage: "Automatique (langue du système)",
        appName: "Shell Easy Uninstaller"
    },
    de: {
        uninstallCompleted: "Deinstallation erfolgreich abgeschlossen.", uninstallFailed: "Deinstallation fehlgeschlagen: {0}", errorLaunching: "Fehler beim Starten des Deinstallationsprogramms: {0}", uninstallingFlatpak: "Flatpak wird deinstalliert: {0}", uninstallingSnap: "Snap wird deinstalliert: {0}", uninstallingDeb: "Deb wird deinstalliert: {0}", couldNotDetermineSnap: "Snap-Name für {0} konnte nicht ermittelt werden", command: "Befehl: {0}", uninstallButton: "Deinstallieren", settingsTitle: "Einstellungen", languageTitle: "Sprache", languageDescription: "Wählen Sie die Sprache für das Optionsmenü, die Deinstallationsaktion und Benachrichtigungen.", displayLanguage: "Anzeigesprache", automaticLanguage: "Automatisch (Systemsprache)", appName: "Shell Easy Uninstaller"
    },
    it: {
        uninstallCompleted: "Disinstallazione completata.", uninstallFailed: "Disinstallazione non riuscita: {0}", errorLaunching: "Errore nell'avvio del programma di disinstallazione: {0}", uninstallingFlatpak: "Disinstallazione di Flatpak: {0}", uninstallingSnap: "Disinstallazione di Snap: {0}", uninstallingDeb: "Disinstallazione di Deb: {0}", couldNotDetermineSnap: "Impossibile determinare il nome Snap per {0}", command: "Comando: {0}", uninstallButton: "Disinstalla", settingsTitle: "Impostazioni", languageTitle: "Lingua", languageDescription: "Scegli la lingua del menu delle opzioni, dell’azione Disinstalla e delle notifiche.", displayLanguage: "Lingua di visualizzazione", automaticLanguage: "Automatico (lingua di sistema)", appName: "Shell Easy Uninstaller"
    },
    pt: {
        uninstallCompleted: "Desinstalação concluída com sucesso.", uninstallFailed: "Falha na desinstalação: {0}", errorLaunching: "Erro ao iniciar o desinstalador: {0}", uninstallingFlatpak: "Desinstalando Flatpak: {0}", uninstallingSnap: "Desinstalando Snap: {0}", uninstallingDeb: "Desinstalando Deb: {0}", couldNotDetermineSnap: "Não foi possível determinar o nome Snap de {0}", command: "Comando: {0}", uninstallButton: "Desinstalar", settingsTitle: "Configurações", languageTitle: "Idioma", languageDescription: "Escolha o idioma do menu de opções, da ação Desinstalar e das notificações.", displayLanguage: "Idioma de exibição", automaticLanguage: "Automático (idioma do sistema)", appName: "Shell Easy Uninstaller"
    },
    zh: {
        uninstallCompleted: "卸载成功完成。", uninstallFailed: "卸载失败：{0}", errorLaunching: "启动卸载程序时出错：{0}", uninstallingFlatpak: "正在卸载 Flatpak：{0}", uninstallingSnap: "正在卸载 Snap：{0}", uninstallingDeb: "正在卸载 Deb：{0}", couldNotDetermineSnap: "无法确定 {0} 的 Snap 名称", command: "命令：{0}", uninstallButton: "卸载", settingsTitle: "设置", languageTitle: "语言", languageDescription: "选择选项菜单、卸载操作和通知所使用的语言。", displayLanguage: "显示语言", automaticLanguage: "自动（系统语言）", appName: "Shell Easy Uninstaller"
    },
    ru: {
        uninstallCompleted: "Удаление успешно завершено.", uninstallFailed: "Ошибка удаления: {0}", errorLaunching: "Ошибка запуска программы удаления: {0}", uninstallingFlatpak: "Удаление Flatpak: {0}", uninstallingSnap: "Удаление Snap: {0}", uninstallingDeb: "Удаление Deb: {0}", couldNotDetermineSnap: "Не удалось определить имя Snap для {0}", command: "Команда: {0}", uninstallButton: "Удалить", settingsTitle: "Настройки", languageTitle: "Язык", languageDescription: "Выберите язык меню параметров, действия удаления и уведомлений.", displayLanguage: "Язык интерфейса", automaticLanguage: "Автоматически (язык системы)", appName: "Shell Easy Uninstaller"
    },
    ja: {
        uninstallCompleted: "アンインストールが完了しました。", uninstallFailed: "アンインストールに失敗しました: {0}", errorLaunching: "アンインストーラーの起動エラー: {0}", uninstallingFlatpak: "Flatpak をアンインストール中: {0}", uninstallingSnap: "Snap をアンインストール中: {0}", uninstallingDeb: "Deb をアンインストール中: {0}", couldNotDetermineSnap: "{0} の Snap 名を特定できませんでした", command: "コマンド: {0}", uninstallButton: "アンインストール", settingsTitle: "設定", languageTitle: "言語", languageDescription: "オプションメニュー、アンインストール操作、通知で使用する言語を選択します。", displayLanguage: "表示言語", automaticLanguage: "自動（システム言語）", appName: "Shell Easy Uninstaller"
    },
    ko: {
        uninstallCompleted: "제거를 완료했습니다.", uninstallFailed: "제거 실패: {0}", errorLaunching: "제거 프로그램 실행 오류: {0}", uninstallingFlatpak: "Flatpak 제거 중: {0}", uninstallingSnap: "Snap 제거 중: {0}", uninstallingDeb: "Deb 제거 중: {0}", couldNotDetermineSnap: "{0}의 Snap 이름을 확인할 수 없습니다", command: "명령: {0}", uninstallButton: "제거", settingsTitle: "설정", languageTitle: "언어", languageDescription: "옵션 메뉴, 제거 작업 및 알림에 사용할 언어를 선택하세요.", displayLanguage: "표시 언어", automaticLanguage: "자동(시스템 언어)", appName: "Shell Easy Uninstaller"
    },
    ar: {
        uninstallCompleted: "اكتملت إزالة التثبيت بنجاح.", uninstallFailed: "فشلت إزالة التثبيت: {0}", errorLaunching: "خطأ في تشغيل أداة إزالة التثبيت: {0}", uninstallingFlatpak: "جارٍ إزالة Flatpak: {0}", uninstallingSnap: "جارٍ إزالة Snap: {0}", uninstallingDeb: "جارٍ إزالة Deb: {0}", couldNotDetermineSnap: "تعذر تحديد اسم Snap لـ {0}", command: "الأمر: {0}", uninstallButton: "إزالة التثبيت", settingsTitle: "الإعدادات", languageTitle: "اللغة", languageDescription: "اختر اللغة المستخدمة في قائمة الخيارات وإجراء إزالة التثبيت والإشعارات.", displayLanguage: "لغة العرض", automaticLanguage: "تلقائي (لغة النظام)", appName: "Shell Easy Uninstaller"
    }
};

export class Translator {
    constructor() {
        this.setLanguage('auto');
    }

    setLanguage(language) {
        this.language = language === 'auto' ? this._detectLanguage() : language;
        this.strings = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    }

    _detectLanguage() {
        // Read language from environment variables
        const envSources = ['LANGUAGE', 'LC_ALL', 'LC_MESSAGES', 'LANG'];
        let locale = 'en';

        for (const env of envSources) {
            const val = GLib.getenv(env);
            if (val) {
                // Typical format: es_ES.UTF-8 -> 'es'
                for (const candidate of val.split(':')) {
                    const lang = candidate.split('_')[0].split('.')[0].toLowerCase();
                    if (TRANSLATIONS[lang]) {
                        return lang;
                    }
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
