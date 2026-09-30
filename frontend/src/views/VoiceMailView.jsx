import React from 'react';
import VoiceMailStudio from '../components/VoiceMailStudio';

export default function VoiceMailView({ onNavigateTab }) {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <VoiceMailStudio onNavigateTab={onNavigateTab} />
    </div>
  );
}
