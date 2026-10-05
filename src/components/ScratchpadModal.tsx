import React, { useRef, useState, useEffect } from 'react';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({ isOpen, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#1d4ed8');
  const [lineWidth, setLineWidth] = useState(2);
  const [activeTab, setActiveTab] = useState<'draw' | 'text'>('draw');
  const [scratchText, setScratchText] = useState(
    '// Rough Work & Topological Sorting Notes\n\nL[v] = w(v) + max({ L[u] : (u, v) in E })\n|V| = 1000 vertices\n|E| = 4500 edges\nTotal = 5500 ops in O(V + E)'
  );

  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl flex flex-col gap-3 border border-[#e5eeff] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8]">draw</span>
            <span className="font-sans font-semibold text-[16px] text-[#0b1c30]">
              Candidate Scratchpad (Rough Work)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-[#eff4ff] p-0.5 border border-[#e5eeff]">
              <button
                onClick={() => setActiveTab('draw')}
                className={`px-3 py-1 rounded-md text-[12px] font-mono cursor-pointer transition-colors ${
                  activeTab === 'draw'
                    ? 'bg-white text-[#1d4ed8] font-bold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`px-3 py-1 rounded-md text-[12px] font-mono cursor-pointer transition-colors ${
                  activeTab === 'text'
                    ? 'bg-white text-[#1d4ed8] font-bold shadow-xs'
                    : 'text-[#45464d] hover:text-[#0b1c30]'
                }`}
              >
                Text Notes
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar when canvas is active */}
        {activeTab === 'draw' ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#45464d] font-mono">Pen Color:</span>
                {['#1d4ed8', '#000000', '#ba1a1a', '#069669'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                      color === c ? 'scale-125 ring-2 ring-offset-1 ring-[#1d4ed8]' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}

                <span className="text-[12px] text-[#45464d] font-mono ml-2">Stroke:</span>
                {[1, 2, 4].map((w) => (
                  <button
                    key={w}
                    onClick={() => setLineWidth(w)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                      lineWidth === w ? 'bg-[#1d4ed8] text-white font-bold' : 'bg-[#eff4ff] text-[#45464d]'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>

              <button
                onClick={clearCanvas}
                className="px-2.5 py-1 rounded bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white font-mono text-[11px] font-bold cursor-pointer transition-colors"
              >
                Clear Sheet
              </button>
            </div>

            <div className="w-full h-80 rounded-xl bg-[#f8f9ff] border-2 border-dashed border-[#dce9ff] overflow-hidden cursor-crosshair relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full block"
              />
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[#c6c6cd] pointer-events-none select-none">
                Scratchpad is encrypted & purged after test submission
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <textarea
              value={scratchText}
              onChange={(e) => setScratchText(e.target.value)}
              rows={12}
              className="w-full rounded-xl bg-[#eff4ff] p-3 font-mono text-[13px] text-[#0b1c30] outline-none border border-[#e5eeff] focus:border-[#1d4ed8] resize-none"
              placeholder="Type rough mathematical notes, pseudocode derivations, or formulas..."
            />
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#131b2e] text-white font-mono text-[12px] font-semibold hover:bg-black cursor-pointer"
          >
            Close Scratchpad
          </button>
        </div>
      </div>
    </div>
  );
};
