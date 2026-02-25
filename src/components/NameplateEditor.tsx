import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Printer, Settings2, Type, Move, Download, Info, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface Nameplate {
  id: string;
  name: string;
  width: number; // in mm
  height: number; // in mm
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
}

const FONTS = [
  { name: 'Sans Serif (Inter)', value: 'font-sans' },
  { name: 'Serif (Playfair)', value: 'font-serif' },
  { name: 'Monospace (JetBrains)', value: 'font-mono' },
  { name: 'Script (Dancing Script)', value: 'font-script' },
  { name: 'Condensed (Roboto)', value: 'font-condensed' },
  { name: 'Modern (Montserrat)', value: 'font-montserrat' },
];

export default function NameplateEditor() {
  const [nameplates, setNameplates] = useState<Nameplate[]>([
    {
      id: '1',
      name: 'Jan de Vries',
      width: 100,
      height: 40,
      fontSize: 24,
      fontFamily: 'font-sans',
      textAlign: 'center',
    },
  ]);

  const [globalWidth, setGlobalWidth] = useState(100);
  const [globalHeight, setGlobalHeight] = useState(40);
  const [globalFont, setGlobalFont] = useState('font-sans');
  const [globalAlign, setGlobalAlign] = useState<'left' | 'center' | 'right'>('center');

  const addNameplate = () => {
    const newPlate: Nameplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      width: globalWidth,
      height: globalHeight,
      fontSize: 24,
      fontFamily: globalFont,
      textAlign: globalAlign,
    };
    setNameplates([...nameplates, newPlate]);
  };

  const removeNameplate = (id: string) => {
    setNameplates(nameplates.filter((p) => p.id !== id));
  };

  const updateNameplate = (id: string, updates: Partial<Nameplate>) => {
    setNameplates(
      nameplates.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const applyGlobalSettings = () => {
    setNameplates(
      nameplates.map((p) => ({
        ...p,
        width: globalWidth,
        height: globalHeight,
        fontFamily: globalFont,
        textAlign: globalAlign,
      }))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans p-4 md:p-8">
      {/* Header - No Print */}
      <header className="max-w-5xl mx-auto mb-8 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif italic tracking-tight text-stone-900">Naamplaatjes Maker</h1>
            <p className="text-stone-500 text-sm mt-1">Ontwerp en print papieren naamplaatjes op maat.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-stone-900 text-stone-50 px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors shadow-sm"
            >
              <Printer size={18} />
              <span>Print Alles</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 no-print">
        {/* Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="flex items-center gap-2 mb-4 text-stone-900 font-semibold">
              <Settings2 size={20} />
              <h2>Standaard Instellingen</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Breedte (mm)</label>
                <input
                  type="number"
                  value={globalWidth}
                  onChange={(e) => setGlobalWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Hoogte (mm)</label>
                <input
                  type="number"
                  value={globalHeight}
                  onChange={(e) => setGlobalHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Lettertype</label>
                <select
                  value={globalFont}
                  onChange={(e) => setGlobalFont(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 outline-none transition-all"
                >
                  {FONTS.map((f) => (
                    <option key={f.value} value={f.value}>{f.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Uitlijning</label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <button
                      key={align}
                      onClick={() => setGlobalAlign(align)}
                      className={`flex-1 py-2 rounded-lg border transition-all flex justify-center ${
                        globalAlign === align 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {align === 'left' && <AlignLeft size={18} />}
                      {align === 'center' && <AlignCenter size={18} />}
                      {align === 'right' && <AlignRight size={18} />}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={applyGlobalSettings}
                className="w-full py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors text-sm font-medium"
              >
                Toepassen op alle plaatjes
              </button>
            </div>
          </section>

          <section className="bg-stone-900 text-stone-400 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-stone-100 font-semibold">
              <Info size={18} />
              <h3>Print Instructies</h3>
            </div>
            <ul className="text-xs space-y-2 list-disc pl-4">
              <li>Zorg dat 'Schalen naar pagina' uit staat in je printinstellingen.</li>
              <li>Stel de marges in op 'Geen' voor de beste resultaten.</li>
              <li>Gebruik stevig papier (160g+) voor een professionele look.</li>
            </ul>
          </section>
        </div>

        {/* Nameplate List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-stone-800">Naamplaatjes ({nameplates.length})</h2>
            <button
              onClick={addNameplate}
              className="flex items-center gap-1 text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              <span>Toevoegen</span>
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {nameplates.map((plate) => (
                <motion.div
                  key={plate.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center"
                >
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      placeholder="Naam invullen..."
                      value={plate.name}
                      onChange={(e) => updateNameplate(plate.id, { name: e.target.value })}
                      className={`w-full text-xl p-2 border-b border-stone-100 focus:border-stone-400 outline-none transition-colors ${plate.fontFamily}`}
                      style={{ textAlign: plate.textAlign }}
                    />
                    <div className="flex gap-4 mt-2 items-center">
                      <div className="flex items-center gap-1 text-stone-400">
                        <Move size={14} />
                        <span className="text-[10px] uppercase font-bold">{plate.width}x{plate.height}mm</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-400">
                        <Type size={14} />
                        <input
                          type="number"
                          value={plate.fontSize}
                          onChange={(e) => updateNameplate(plate.id, { fontSize: Number(e.target.value) })}
                          className="w-12 bg-transparent text-[10px] font-bold outline-none focus:text-stone-600"
                        />
                        <span className="text-[10px] uppercase font-bold">pt</span>
                      </div>
                      <div className="flex gap-1 ml-auto">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateNameplate(plate.id, { textAlign: align })}
                            className={`p-1 rounded transition-all ${
                              plate.textAlign === align 
                                ? 'bg-stone-200 text-stone-900' 
                                : 'text-stone-300 hover:text-stone-500'
                            }`}
                          >
                            {align === 'left' && <AlignLeft size={14} />}
                            {align === 'center' && <AlignCenter size={14} />}
                            {align === 'right' && <AlignRight size={14} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="hidden md:block border border-stone-100 bg-stone-50 rounded overflow-hidden"
                      style={{ width: '60px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <div 
                        className={`bg-white border border-stone-300 shadow-xs flex items-center justify-center overflow-hidden ${plate.fontFamily}`}
                        style={{ 
                          width: `${plate.width / 2}px`, 
                          height: `${plate.height / 2}px`,
                          fontSize: `${plate.fontSize / 4}px`
                        }}
                      >
                        {plate.name || '...'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeNameplate(plate.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Print Area - Only visible when printing */}
      <div className="hidden print-area">
        <div className="flex flex-wrap gap-0">
          {nameplates.map((plate) => (
            <div
              key={plate.id}
              className={`border border-stone-300 flex items-center overflow-hidden break-inside-avoid ${plate.fontFamily}`}
              style={{
                width: `${plate.width}mm`,
                height: `${plate.height}mm`,
                fontSize: `${plate.fontSize}pt`,
                textAlign: plate.textAlign,
                justifyContent: plate.textAlign === 'left' ? 'flex-start' : plate.textAlign === 'right' ? 'flex-end' : 'center',
                padding: '2mm',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <span className="w-full">{plate.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer - No Print */}
      <footer className="max-w-5xl mx-auto mt-12 pt-8 border-t border-stone-200 text-stone-400 text-xs text-center no-print space-y-1">
        <p>&copy; {new Date().getFullYear()} Naamplaatjes Maker - Voor nauwkeurige papieren naamplaatjes.</p>
        <p>Intellectueel eigendom &bull; Ontwikkeld door R.Schäffer</p>
      </footer>
    </div>
  );
}
