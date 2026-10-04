import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import type { HomeAssistant } from '../../types/homeassistant';
import './ObstaclePictureDialog.scss';

interface DialogParams {
  title?: string;
  content?: string;
  type?: string;
  possibility?: number;
  room?: string;
}

class DreameObstaclePictureDialog extends HTMLElement {
  private root?: Root;
  private params?: DialogParams;
  public hass?: HomeAssistant;

  connectedCallback() {
    this.renderDialog();
  }

  showDialog(params: DialogParams) {
    this.params = params;
    this.renderDialog();
  }

  closeDialog() {
    this.dispatchEvent(new CustomEvent('dialog-closed', { bubbles: true, composed: true }));
  }

  private renderDialog() {
    if (!this.isConnected || !this.params) return;
    if (!this.root) this.root = createRoot(this);
    const p = this.params;
    this.root.render(
      <div className="dreame-obstacle-dialog">
        <div className="dreame-obstacle-dialog__header">
          <button type="button" className="dreame-obstacle-dialog__close" aria-label="Close" onClick={() => this.closeDialog()}>×</button>
          <div>
            <div className="dreame-obstacle-dialog__title">{p.type ?? p.title ?? 'Detected obstacle'}</div>
            <div className="dreame-obstacle-dialog__meta">
              {p.possibility !== undefined && <span>{p.possibility}% confidence</span>}
              {p.room && <span>{p.room}</span>}
            </div>
          </div>
        </div>
        <div className="dreame-obstacle-dialog__body">
          {p.content ? <img src={p.content} alt={`${p.type ?? 'Obstacle'} detected by vacuum`} /> : <div>Picture unavailable</div>}
        </div>
      </div>
    );
  }
}

if (!customElements.get('dreame-obstacle-picture-dialog')) {
  customElements.define('dreame-obstacle-picture-dialog', DreameObstaclePictureDialog);
}
