import './Toggle.scss';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked = false, onChange, disabled = false }: ToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={`toggle ${disabled ? 'toggle--disabled' : ''}`}>
      <input type="checkbox" className="toggle__input" checked={checked} onChange={handleChange} disabled={disabled} />
      <span className="toggle__slider">
        <span className="toggle__knob" />
      </span>
    </label>
  );
}
