import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import './Accordion.scss';

interface AccordionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({ title, icon, defaultOpen = false, children }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className={`accordion ${isOpen ? 'accordion--open' : ''}`}>
      <button className="accordion__header" onClick={handleToggle} type="button">
        <div className="accordion__title-wrapper">
          {icon && <span className="accordion__icon">{icon}</span>}
          <span className="accordion__title">{title}</span>
        </div>
        <ChevronDown className="accordion__chevron" />
      </button>
      <div className="accordion__content">
        <div className="accordion__content-inner">{children}</div>
      </div>
    </div>
  );
}
