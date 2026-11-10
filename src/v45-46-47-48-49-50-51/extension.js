import { AppMenu } from 'resource:///org/gnome/shell/ui/appMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {
    Extension,
    InjectionManager,
    gettext as _,
} from 'resource:///org/gnome/shell/extensions/extension.js';

import { uninstallApp } from './utils.js';

export default class DashUninstallExtension extends Extension {
    enable() {
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
                
                // Add a separator
                this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
                
                // Add Uninstall item
                const uninstallItem = new PopupMenu.PopupMenuItem(_('Uninstall'));
                uninstallItem._isUninstallItem = true; // Mark it
                
                // Make it look destructive (optional styling)
                uninstallItem.label.set_style('color: #ff6b6b;'); 
                
                uninstallItem.connect('activate', () => {
                    // Close menu
                    this.close();
                    
                    // Trigger uninstall logic
                    uninstallApp(app);
                });
                
                this.addMenuItem(uninstallItem);
            }
        });
    }

    disable() {
        this._injectionManager?.clear();
        this._injectionManager = null;
    }
}
