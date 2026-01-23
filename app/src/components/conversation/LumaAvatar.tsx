import { useRef, useEffect, useState } from 'react';
import { ConversationMode } from '../../lib/gemini-conversation';

interface LumaAvatarProps {
  mode: ConversationMode;
  isAgentSpeaking: boolean;
  isListening: boolean;
  audioAmplitude?: number; // 0-1 for animation intensity
  size?: 'small' | 'medium' | 'large';
}

const LUMA_VIDEO_URL = 'https://wgrqgcwabpebxtkwmnkb.supabase.co/storage/v1/object/public/video/lumna.mov';

export function LumaAvatar({
  mode,
  isAgentSpeaking,
  isListening,
  audioAmplitude = 0,
  size = 'medium',
}: LumaAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine size based on mode and explicit size prop
  const effectiveSize = mode === 'text' ? 'small' : size;

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  const containerSizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-56 h-56',
  };

  // Calculate animation scale based on audio amplitude
  const bounceScale = isAgentSpeaking ? 1 + (audioAmplitude * 0.15) : 1;
  const glowIntensity = isAgentSpeaking ? 0.3 + (audioAmplitude * 0.4) : 0;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, will start on user interaction
      });
    }
  }, []);

  return (
    <div
      className={`
        relative flex items-center justify-center
        ${containerSizeClasses[effectiveSize]}
        transition-all duration-300 ease-out
      `}
    >
      {/* Glow ring when speaking */}
      {isAgentSpeaking && (
        <div
          className="absolute inset-0 rounded-full bg-lavender blur-xl transition-opacity duration-200"
          style={{ opacity: glowIntensity }}
        />
      )}

      {/* Listening ring */}
      {isListening && !isAgentSpeaking && (
        <div className="absolute inset-0 rounded-full border-4 border-mint animate-pulse" />
      )}

      {/* Avatar container with bounce animation */}
      <div
        className={`
          relative rounded-full overflow-hidden shadow-lg
          ${sizeClasses[effectiveSize]}
          transition-transform duration-100 ease-out
          ${isAgentSpeaking ? 'ring-4 ring-lavender/50' : ''}
          ${isListening && !isAgentSpeaking ? 'ring-4 ring-mint/50' : ''}
        `}
        style={{
          transform: `scale(${bounceScale})`,
        }}
      >
        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-lavender-light to-mint-light animate-pulse" />
        )}

        {/* Luma video */}
        <video
          ref={videoRef}
          className={`
            w-full h-full object-cover
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          autoPlay
          loop
          muted
          playsInline
          src={LUMA_VIDEO_URL}
          onLoadedData={() => setIsLoaded(true)}
        />

        {/* Speaking overlay effect */}
        {isAgentSpeaking && (
          <div
            className="absolute inset-0 bg-lavender/10 transition-opacity duration-100"
            style={{ opacity: audioAmplitude * 0.3 }}
          />
        )}
      </div>

      {/* Status indicator dot */}
      <div
        className={`
          absolute -bottom-1 -right-1
          w-4 h-4 rounded-full border-2 border-white
          transition-colors duration-300
          ${isAgentSpeaking ? 'bg-lavender animate-pulse' : ''}
          ${isListening && !isAgentSpeaking ? 'bg-mint animate-pulse' : ''}
          ${!isAgentSpeaking && !isListening ? 'bg-sky' : ''}
        `}
      />
    </div>
  );
}
