import React from 'react';

export default function ConditionalField({ triggerValue, hideValue = 'no', children }) {
  const shouldHide = triggerValue === hideValue || !triggerValue;

  return (
    <div className={`follow-up ${shouldHide ? 'hidden' : ''}`}>
      {children}
    </div>
  );
}
