import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Printer, Settings2, Type, Move, Download, Info, AlignLeft, AlignCenter, AlignRight, FileText, ClipboardList, Upload, Square, Bookmark } from 'lucide-react';
import * as mammoth from 'mammoth';

interface Nameplate {
  id: string;
  name: string;
  width: number; // in mm
  height: number; // in mm
  fontSize: number;
  fontFamily: string;
  textAlign: 'left' | 'center' | 'right';
  shape: 'rectangle' | 'banner';
}

const PRESETS = [
  { name: 'Standaard (100x40mm)', width: 100, height: 40 },
  { name: 'Klein (75x30mm)', width: 75, height: 30 },
  { name: 'Groot (150x50mm)', width: 150, height: 50 },
  { name: 'Visitekaart (85x55mm)', width: 85, height: 55 },
  { name: 'Badge (90x60mm)', width: 90, height: 60 },
];

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
      name: 'Raymond Schäffer',
      width: 100,
      height: 40,
      fontSize: 24,
      fontFamily: 'font-sans',
      textAlign: 'center',
      shape: 'banner',
    },
  ]);

  const [globalWidth, setGlobalWidth] = useState(100);
  const [globalHeight, setGlobalHeight] = useState(40);
  const [globalFont, setGlobalFont] = useState('font-sans');
  const [globalAlign, setGlobalAlign] = useState<'left' | 'center' | 'right'>('center');
  const [globalShape, setGlobalShape] = useState<'rectangle' | 'banner'>('banner');
  const [bulkNames, setBulkNames] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);

  const addNameplate = () => {
    const newPlate: Nameplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      width: globalWidth,
      height: globalHeight,
      fontSize: 24,
      fontFamily: globalFont,
      textAlign: globalAlign,
      shape: globalShape,
    };
    setNameplates([...nameplates, newPlate]);
  };

  const handleBulkAdd = () => {
    const names = bulkNames.split('\n').filter(n => n.trim() !== '');
    const newPlates = names.map(name => ({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      width: globalWidth,
      height: globalHeight,
      fontSize: 24,
      fontFamily: globalFont,
      textAlign: globalAlign,
      shape: globalShape,
    }));
    setNameplates([...nameplates, ...newPlates]);
    setBulkNames('');
    setShowBulkModal(false);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setGlobalWidth(preset.width);
    setGlobalHeight(preset.height);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        // Clean up the text: remove empty lines and trim
        const cleanedText = result.value
          .split('\n')
          .map(line => line.trim())
          .filter(line => line !== '')
          .join('\n');
        setBulkNames(cleanedText);
      } catch (error) {
        console.error('Error parsing Word document:', error);
        alert('Er is een fout opgetreden bij het lezen van het Word-document.');
      }
    };
    reader.readAsArrayBuffer(file);
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
        shape: globalShape,
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
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Sjablonen</label>
                <select
                  onChange={(e) => {
                    const preset = PRESETS.find(p => p.name === e.target.value);
                    if (preset) applyPreset(preset);
                  }}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-stone-200 outline-none transition-all text-sm"
                >
                  <option value="">Kies een sjabloon...</option>
                  {PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-stone-500 mb-1">Vorm</label>
                <div className="flex gap-1">
                  {(['rectangle', 'banner'] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setGlobalShape(shape)}
                      className={`flex-1 py-2 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                        globalShape === shape 
                          ? 'bg-stone-900 text-white border-stone-900' 
                          : 'bg-stone-50 text-stone-400 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {shape === 'rectangle' ? <Square size={16} /> : <Bookmark size={16} className="rotate-90" />}
                      <span className="text-[10px] font-bold uppercase">{shape === 'rectangle' ? 'Rechthoek' : 'Banner'}</span>
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
            <div className="flex gap-2">
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-1 text-sm bg-stone-100 text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors"
              >
                <ClipboardList size={16} />
                <span>Bulk Import</span>
              </button>
              <button
                onClick={addNameplate}
                className="flex items-center gap-1 text-sm bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Plus size={16} />
                <span>Toevoegen</span>
              </button>
            </div>
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
                        {(['rectangle', 'banner'] as const).map((shape) => (
                          <button
                            key={shape}
                            onClick={() => updateNameplate(plate.id, { shape })}
                            className={`p-1 rounded transition-all ${
                              plate.shape === shape 
                                ? 'bg-stone-200 text-stone-900' 
                                : 'text-stone-300 hover:text-stone-500'
                            }`}
                            title={shape === 'rectangle' ? 'Rechthoek' : 'Banner'}
                          >
                            {shape === 'rectangle' ? <Square size={14} /> : <Bookmark size={14} className="rotate-90" />}
                          </button>
                        ))}
                        <div className="w-px h-4 bg-stone-100 mx-1"></div>
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
              className={`relative flex items-center overflow-hidden break-inside-avoid ${plate.fontFamily}`}
              style={{
                width: `${plate.width}mm`,
                height: `${plate.height}mm`,
                fontSize: `${plate.fontSize}pt`,
                textAlign: plate.textAlign,
                justifyContent: plate.textAlign === 'left' ? 'flex-start' : plate.textAlign === 'right' ? 'flex-end' : 'center',
                padding: plate.shape === 'banner' ? '2mm 6mm 2mm 8mm' : '2mm',
                boxSizing: 'border-box',
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              {plate.shape === 'banner' ? (
                <svg 
                  viewBox="0 0 100 40" 
                  preserveAspectRatio="none" 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  <path 
                    d="M 12,0 H 100 Q 88,20 100,40 H 12 A 12,20 0 0 1 12,0 Z" 
                    fill="none" 
                    stroke="black" 
                    strokeWidth="0.5" 
                  />
                </svg>
              ) : (
                <div className="absolute inset-0 border border-black pointer-events-none"></div>
              )}
              <span className="w-full relative z-10">{plate.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Import Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-stone-900">Namen Importeren</h3>
                <button onClick={() => setShowBulkModal(false)} className="text-stone-400 hover:text-stone-600">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-stone-500">
                    Importeer namen uit een Word-document (.docx) of plak ze hieronder (één naam per regel).
                  </p>
                  
                  <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-stone-100 text-stone-700 rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 hover:bg-stone-200 cursor-pointer transition-all group">
                    <Upload size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Word-document selecteren</span>
                    <input 
                      type="file" 
                      accept=".docx" 
                      className="hidden" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-stone-400 font-semibold tracking-widest">of plak tekst</span>
                  </div>
                </div>

                <textarea
                  value={bulkNames}
                  onChange={(e) => setBulkNames(e.target.value)}
                  placeholder="Bijv:&#10;Jan de Vries&#10;Marieke Jansen&#10;Pieter Post"
                  className="w-full h-48 p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-stone-200 transition-all font-mono text-sm"
                />
              </div>
              <div className="p-6 bg-stone-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 text-stone-600 font-medium hover:text-stone-900"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleBulkAdd}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Toevoegen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer - No Print */}
      <footer className="max-w-5xl mx-auto mt-12 pt-8 border-t border-stone-200 text-stone-400 text-xs text-center no-print space-y-1">
        <p>&copy; {new Date().getFullYear()} Naamplaatjes Maker - Voor nauwkeurige papieren naamplaatjes.</p>
        <p>Intellectueel eigendom &bull; Ontwikkeld door R.Schäffer</p>
      </footer>
    </div>
  );
}
