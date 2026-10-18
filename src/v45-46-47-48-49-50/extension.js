import { AppMenu } from 'resource:///org/gnome/shell/ui/appMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {
    Extension,
    InjectionManager,
    gettext as _,
} from 'resource:///org/gnome/shell/extensions/extension.js';

import { AppUninstaller } from './AppUninstaller.js';
import { CommandExecutor } from './CommandExecutor.js';
import { UninstallDialog } from './UninstallDialog.js';

export default class DashUninstallExtension extends Extension {
    enable() {
        const extension = this;
        this._settings = this.getSettings();
        this._injectionManager = new InjectionManager();
        this._injectionManager.overrideMethod(AppMenu.prototype, 'open',
            originalMethod => function (animate) {
            originalMethod.call(this, animate);
            
            // At this point, the menu is populated with standard items.
            // Check if our item is already added to avoid duplicates.
            const existingUninstallItem = this._getMenuItems().find(
                item => item._isUninstallItem
            );

            // Keep an existing menu item in sync with the active locale.
            if (existingUninstallItem)
                existingUninstallItem.label.set_text(_('Uninstall'));
            
            if (!existingUninstallItem && this._app) {
                const app = this._app;

                // Add Uninstall item
                const uninstallItem = new PopupMenu.PopupMenuItem(_('Uninstall'));
                uninstallItem._isUninstallItem = true; // Mark it
                
                // Make it look destructive (optional styling)
                uninstallItem.label.set_style('color: #ff6b6b;'); 
                
                uninstallItem.connect('activate', () => {
                    // Close menu
                    this.close();
                    
                    // Trigger uninstall logic
                    extension._uninstall(app).catch(e =>
                        logError(e, 'Failed to uninstall application'));
                });
                
                // Place it right below "App Details" so "Quit" stays last.
                // Fall back to appending if the details item is missing.
                const detailsIndex = this._getMenuItems().indexOf(this._detailsItem);
                if (detailsIndex >= 0)
                    this.addMenuItem(uninstallItem, detailsIndex + 1);
                else
                    this.addMenuItem(uninstallItem);
            }
        });
    }

    async _uninstall(app) {
        const plan = await new AppUninstaller(app).resolve();

        // The extension may have been disabled while the package was resolved.
        if (!plan || !this._settings)
            return;

        if (!this._settings.get_boolean('confirm-uninstall')) {
            CommandExecutor.runPlan(plan, false);
            return;
        }

        this._dialog?.destroy();
        const dialog = new UninstallDialog(app, plan,
            purge => CommandExecutor.runPlan(plan, purge));
        dialog.connect('destroy', () => {
            if (this._dialog === dialog)
                this._dialog = null;
        });
        this._dialog = dialog;
        dialog.open();
    }

    disable() {
        this._dialog?.destroy();
        this._dialog = null;
        this._settings = null;
        this._injectionManager?.clear();
        this._injectionManager = null;
    }
}
