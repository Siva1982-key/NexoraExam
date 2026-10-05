import React, { useState } from 'react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('5500');
  const [subDisplay, setSubDisplay] = useState('O(|V| + |E|) where |V|=1000, |E|=4500');
  const [isScientific, setIsScientific] = useState(false);

  if (!isOpen) return null;

  const handleKey = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setSubDisplay('');
    } else if (val === 'DEL') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === '=') {
      try {
        setSubDisplay(display);
        // Clean mathematical evaluation
        const sanitized = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E')
          .replace(/\^/g, '**');

        // Safe function eval
        // eslint-disable-next-line no-new-func
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (Number.isFinite(result)) {
          setDisplay(String(Math.round(result * 1e8) / 1e8));
        } else {
          setDisplay('Error');
        }
      } catch {
        setDisplay('Error');
      }
    } else if (val === 'sqrt') {
      try {
        const num = parseFloat(display);
        if (num >= 0) {
          setSubDisplay(`√(${display})`);
          setDisplay(String(Math.round(Math.sqrt(num) * 1e8) / 1e8));
        } else {
          setDisplay('Invalid Input');
        }
      } catch {
        setDisplay('Error');
      }
    } else if (val === 'sq') {
      try {
        const num = parseFloat(display);
        setSubDisplay(`sqr(${display})`);
        setDisplay(String(Math.round(num * num * 1e8) / 1e8));
      } catch {
        setDisplay('Error');
      }
    } else {
      if (display === '0' || display === 'Error' || display === 'Invalid Input') {
        setDisplay(val);
      } else {
        setDisplay((prev) => prev + val);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-sm w-full p-4 shadow-2xl flex flex-col gap-3 border border-[#e5eeff] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2 font-sans font-semibold text-[15px] text-[#0b1c30]">
            <span className="material-symbols-outlined text-[#1d4ed8]">calculate</span>
            <span>Scientific Calculator</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsScientific(!isScientific)}
              className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#eff4ff] text-[#1d4ed8] hover:bg-[#dce9ff] cursor-pointer"
            >
              {isScientific ? 'Standard' : 'Scientific'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Display Screen */}
        <div className="w-full bg-[#eff4ff] rounded-xl p-3.5 text-right border border-[#e5eeff]">
          <div className="font-mono text-[11px] text-[#45464d] min-h-[16px] truncate">
            {subDisplay || '\u00A0'}
          </div>
          <div className="font-mono text-2xl font-bold text-[#0b1c30] tracking-tight overflow-x-auto">
            {display}
          </div>
        </div>

        {/* Scientific Row (if enabled) */}
        {isScientific && (
          <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
            <button
              onClick={() => handleKey('sqrt')}
              className="p-1.5 rounded-lg bg-[#eff4ff] text-[#1d4ed8] hover:bg-[#dce9ff] font-semibold cursor-pointer"
            >
              √x
            </button>
            <button
              onClick={() => handleKey('sq')}
              className="p-1.5 rounded-lg bg-[#eff4ff] text-[#1d4ed8] hover:bg-[#dce9ff] font-semibold cursor-pointer"
            >
              x²
            </button>
            <button
              onClick={() => handleKey('^')}
              className="p-1.5 rounded-lg bg-[#eff4ff] text-[#1d4ed8] hover:bg-[#dce9ff] font-semibold cursor-pointer"
            >
              x^y
            </button>
            <button
              onClick={() => handleKey('DEL')}
              className="p-1.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white font-semibold cursor-pointer"
            >
              DEL
            </button>
          </div>
        )}

        {/* Standard Keypad Grid */}
        <div className="grid grid-cols-4 gap-1.5 font-mono text-[13px]">
          <button
            onClick={() => handleKey('C')}
            className="p-2.5 rounded-lg bg-[#e5eeff] text-[#ba1a1a] hover:bg-[#ffdad6] font-bold cursor-pointer"
          >
            C
          </button>
          <button
            onClick={() => handleKey('(')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-medium cursor-pointer"
          >
            (
          </button>
          <button
            onClick={() => handleKey(')')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-medium cursor-pointer"
          >
            )
          </button>
          <button
            onClick={() => handleKey('÷')}
            className="p-2.5 rounded-lg bg-[#dce9ff] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold cursor-pointer transition-colors"
          >
            ÷
          </button>

          <button
            onClick={() => handleKey('7')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            7
          </button>
          <button
            onClick={() => handleKey('8')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            8
          </button>
          <button
            onClick={() => handleKey('9')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            9
          </button>
          <button
            onClick={() => handleKey('×')}
            className="p-2.5 rounded-lg bg-[#dce9ff] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold cursor-pointer transition-colors"
          >
            ×
          </button>

          <button
            onClick={() => handleKey('4')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            4
          </button>
          <button
            onClick={() => handleKey('5')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            5
          </button>
          <button
            onClick={() => handleKey('6')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            6
          </button>
          <button
            onClick={() => handleKey('-')}
            className="p-2.5 rounded-lg bg-[#dce9ff] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold cursor-pointer transition-colors"
          >
            -
          </button>

          <button
            onClick={() => handleKey('1')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            1
          </button>
          <button
            onClick={() => handleKey('2')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            2
          </button>
          <button
            onClick={() => handleKey('3')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            3
          </button>
          <button
            onClick={() => handleKey('+')}
            className="p-2.5 rounded-lg bg-[#dce9ff] text-[#1d4ed8] hover:bg-[#1d4ed8] hover:text-white font-bold cursor-pointer transition-colors"
          >
            +
          </button>

          <button
            onClick={() => handleKey('0')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            0
          </button>
          <button
            onClick={() => handleKey('.')}
            className="p-2.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff] font-semibold cursor-pointer"
          >
            .
          </button>
          <button
            onClick={() => handleKey('=')}
            className="col-span-2 p-2.5 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1e40af] font-bold cursor-pointer shadow-xs transition-colors"
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
