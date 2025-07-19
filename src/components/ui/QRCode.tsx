import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
  onDownload?: () => void;
}

const QRCodeComponent: React.FC<QRCodeProps> = ({ 
  value, 
  size = 80, 
  className = '',
  onDownload 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [value, size]);

  const handleDownload = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `ticket-qr-${value}.png`;
      link.href = canvas.toDataURL();
      link.click();
      if (onDownload) {
        onDownload();
      }
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg"
        style={{ width: 80, height: 80 }}
      />
      {onDownload && (
        <button
          onClick={handleDownload}
          className="mt-2 w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded transition-colors"
        >
          Download QR
        </button>
      )}
    </div>
  );
};

export default QRCodeComponent; 