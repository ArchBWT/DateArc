import React, { useState, useEffect, useRef } from 'react';

export function StepWrapper({ stepKey, direction, children }) {
  const [animClass, setAnimClass] = useState('');
  const prevKeyRef = useRef(stepKey);

  useEffect(() => {
    if (prevKeyRef.current !== stepKey) {
      const cls = direction === 'back' ? 'step-enter-back' : 'step-enter';
      setAnimClass(cls);
      prevKeyRef.current = stepKey;
      const t = setTimeout(() => setAnimClass(''), 400);
      return () => clearTimeout(t);
    }
  }, [stepKey, direction]);

  return (
    <div className={`step-wrapper ${animClass}`}>
      {children}
    </div>
  );
}
