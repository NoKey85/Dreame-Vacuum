import './ObstaclePictureDialog.scss';

interface DialogParams {
  title?: string;
  content?: string;
  type?: string;
  possibility?: number;
  room?: string;
}

/**
 * Home Assistant 2026 dialog-manager compatible obstacle picture dialog.
 *
 * HA's current manager detects dialogNext=true, assigns params before the
 * element is connected, then appends it to the frontend dialog host.  The
 * adaptive dialog supplies the real modal/scrim/focus behavior.
 */
class DreameObstaclePictureDialog extends HTMLElement {
  public readonly dialogNext = true as const;
  public dialogAnchor?: Element;

  private _params?: DialogParams;
  private _dialog?: HTMLElement & { open?: boolean };
  private _closed = false;

  set params(value: DialogParams | undefined) {
    this._params = value;
    if (this.isConnected) this.renderDialog();
  }

  get params() {
    return this._params;
  }

  connectedCallback() {
    this._closed = false;
    this.renderDialog();
  }

  public closeDialog(): Promise<boolean> | boolean {
    if (!this._dialog) {
      this.finishClose();
      return true;
    }
    this._dialog.open = false;
    return true;
  }

  private finishClose = (event?: Event) => {
    event?.stopPropagation();
    if (this._closed) return;
    this._closed = true;
    this.dispatchEvent(new CustomEvent('dialog-closed', {
      bubbles: true,
      composed: true,
      detail: { dialog: this.localName },
    }));
    this.remove();
  };

  private renderDialog() {
    if (!this.isConnected || !this._params) return;

    this.replaceChildren();

    const dialog = document.createElement('ha-adaptive-dialog') as HTMLElement & {
      open?: boolean;
      width?: string;
      headerTitle?: string;
      hideCloseButton?: boolean;
      withoutHeader?: boolean;
    };
    dialog.open = true;
    dialog.width = 'medium';
    dialog.headerTitle = this._params.type ?? this._params.title ?? 'Detected obstacle';
    dialog.hideCloseButton = true;
    dialog.addEventListener('closed', this.finishClose, { once: true });
    this._dialog = dialog;

    const close = document.createElement('button');
    close.type = 'button';
    close.slot = 'headerActionItems';
    close.className = 'dreame-obstacle-dialog__close';
    close.setAttribute('aria-label', 'Close');
    close.textContent = '×';
    close.addEventListener('click', () => this.closeDialog());
    dialog.appendChild(close);

    const body = document.createElement('div');
    body.className = 'dreame-obstacle-dialog';

    const meta = document.createElement('div');
    meta.className = 'dreame-obstacle-dialog__meta';
    const details = [
      this._params.possibility !== undefined ? `${this._params.possibility}% confidence` : undefined,
      this._params.room,
    ].filter(Boolean);
    meta.textContent = details.join(' · ');
    if (details.length) body.appendChild(meta);

    const picture = document.createElement('div');
    picture.className = 'dreame-obstacle-dialog__body';
    if (this._params.content) {
      const img = document.createElement('img');
      img.src = this._params.content;
      img.alt = `${this._params.type ?? 'Obstacle'} detected by vacuum`;
      picture.appendChild(img);
    } else {
      picture.textContent = 'Picture unavailable';
    }
    body.appendChild(picture);
    dialog.appendChild(body);

    this.appendChild(dialog);
  }
}

if (!customElements.get('dreame-obstacle-picture-dialog')) {
  customElements.define('dreame-obstacle-picture-dialog', DreameObstaclePictureDialog);
}
