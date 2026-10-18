import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import { CheckBox } from 'resource:///org/gnome/shell/ui/checkBox.js';
import * as Dialog from 'resource:///org/gnome/shell/ui/dialog.js';
import * as ModalDialog from 'resource:///org/gnome/shell/ui/modalDialog.js';
import {gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';

// Asks the user to confirm an uninstall plan before it runs.
// onConfirm is called with true when the plan's purge option is selected.
export const UninstallDialog = GObject.registerClass(
class UninstallDialog extends ModalDialog.ModalDialog {
    _init(app, plan, onConfirm) {
        super._init();

        const lines = [_('Package type: %s').format(plan.typeLabel)];
        if (plan.packageName)
            lines.push(_('Package: %s').format(plan.packageName));
        lines.push(...plan.details ?? []);
        const description = lines.join('\n');

        const content = new Dialog.MessageDialogContent({
            title: _('Uninstall %s?').format(app.get_name()),
            description,
        });
        this.contentLayout.add_child(content);

        let purgeLabel = plan.purgeLabel ?? _('Remove configuration files');
        if (!plan.supportsPurge)
            purgeLabel = _('Remove configuration files (not supported for this package)');

        // A forced option is shown checked but cannot be changed.
        const editable = plan.supportsPurge && !plan.purgeForced;
        this._purgeCheckBox = new CheckBox(purgeLabel);
        this._purgeCheckBox.checked = Boolean(plan.purgeForced);
        this._purgeCheckBox.reactive = editable;
        this._purgeCheckBox.can_focus = editable;
        if (!editable)
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
