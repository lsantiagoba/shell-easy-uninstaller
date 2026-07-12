import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { AppMenu } from 'resource:///org/gnome/shell/ui/appMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';

import { uninstallApp } from './utils.js';
import { _t } from './translations.js';

export default class DashUninstallExtension extends Extension {
    enable() {
        this._injections = [];
        
        // Monkey patch AppMenu to add our "Uninstall" action
        const origOpen = AppMenu.prototype.open;
        const extension = this;

        AppMenu.prototype.open = function (animate) {
            // Call original to open the menu
            origOpen.call(this, animate);
            
            // At this point, the menu is populated with standard items.
            // Check if our item is already added to avoid duplicates.
            const hasUninstall = this._getMenuItems().some(
                item => item._isUninstallItem
            );
            
            if (!hasUninstall && this._app) {
                const app = this._app;
                
                // Add a separator
                this.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
                
                // Add Uninstall item
                const uninstallItem = new PopupMenu.PopupMenuItem(_t('uninstallButton'));
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
        };

        this._injections.push({
            obj: AppMenu.prototype,
            method: 'open',
            orig: origOpen,
        });
    }

    disable() {
        // Restore injected methods
        for (const inj of this._injections) {
            inj.obj[inj.method] = inj.orig;
        }
        this._injections = [];
    }
}

