import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import { CheckBox } from 'resource:///org/gnome/shell/ui/checkBox.js';
import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

// Asks the user to confirm an uninstall plan before it runs.
// onConfirm is called with true when configuration files should be removed.
export const UninstallDialog = GObject.registerClass(
class UninstallDialog extends ModalDialog.ModalDialog {
    _init(app, plan, onConfirm) {
        super._init();

        const description = [
            _('Package type: %s').format(plan.typeLabel),
            _('Package: %s').format(plan.packageName),
        ].join('\n');

        const content = new Dialog.MessageDialogContent({
            title: _('Uninstall %s?').format(app.get_name()),
            description,
        });
        this.contentLayout.add_child(content);

        this._purgeCheckBox = new CheckBox(plan.supportsPurge
            ? _('Remove configuration files')
            : _('Remove configuration files (not supported for this package)'));
        this._purgeCheckBox.reactive = plan.supportsPurge;
        this._purgeCheckBox.can_focus = plan.supportsPurge;
        if (!plan.supportsPurge)
            this._purgeCheckBox.opacity = 128;
        this.contentLayout.add_child(this._purgeCheckBox);

        this.addButton({
            label: _('Cancel'),
            action: () => this.close(),
            key: Clutter.KEY_Escape,
        });
        this.addButton({
            label: _('Uninstall'),
            action: () => {
                const purge = plan.supportsPurge && this._purgeCheckBox.checked;
                this.close();
                onConfirm(purge);
            },
        });
    }
});
