import { useRef, useEffect, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';

interface VideoCallAreaProps {
  stream: MediaStream | null;
  onCapture: (imageBase64: string) => void;
  isAnalyzing?: boolean;
}

export function VideoCallArea({ stream, onCapture, isAnalyzing }: VideoCallAreaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        setIsReady(true);
      };
    }
  }, [stream]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    const base64 = imageData.split(',')[1];
    onCapture(base64);
  };

  if (!stream) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-light/10 rounded-2xl">
        <div className="text-center text-slate/60">
          <Camera size={48} className="mx-auto mb-4 opacity-50" />
          <p>Camera not available</p>
          <p className="text-sm mt-2">Switch to video mode to enable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 rounded-2xl overflow-hidden bg-black">
      {/* Camera preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Capture button */}
      <button
        onClick={captureFrame}
        disabled={isAnalyzing || !isReady}
        className={`
          absolute bottom-4 left-1/2 -translate-x-1/2
          w-14 h-14 rounded-full
          bg-lavender text-white
          flex items-center justify-center
          shadow-lg hover:bg-lavender-dark
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
        `}
        title="Capture and analyze"
      >
        {isAnalyzing ? (
          <Loader2 size={24} className="animate-spin" />
        ) : (
          <Camera size={24} />
        )}
      </button>

      {/* Analyzing overlay */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-white text-center">
            <Loader2 size={32} className="animate-spin mx-auto mb-2" />
            <p>Luma is looking...</p>
          </div>
        </div>
      )}
    </div>
  );
}
