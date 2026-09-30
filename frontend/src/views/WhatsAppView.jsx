import React from 'react';
import WhatsAppIntakeSimulator from '../components/WhatsAppIntakeSimulator';

export default function WhatsAppView({ onNavigateTab }) {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <WhatsAppIntakeSimulator onNavigateTab={onNavigateTab} />
    </div>
  );
}
