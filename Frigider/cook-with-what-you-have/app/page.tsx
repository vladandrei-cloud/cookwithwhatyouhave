'use client';
import { useState, useEffect } from 'react';
import { reteteData, ingredienteSugerate } from './data';

export default function Home() {
  const [ingredienteFrigider, setIngredienteFrigider] = useState([]);
  const [inputIngredient, setInputIngredient] = useState('');
  const [reteteGasite, setReteteGasite] = useState([]);
  const [categorieSelectata, setCategorieSelectata] = useState('Toate');

  // Căutare și filtrare automată în timp real
  useEffect(() => {
    if (ingredienteFrigider.length === 0) {
      setReteteGasite([]);
      return;
    }

    const rezultate = reteteData.map(reteta => {
      const ingredienteDetinute = reteta.ingrediente.filter(ingr => 
        ingredienteFrigider.includes(ingr.toLowerCase())
      );

      return {
        ...reteta,
        potrivire: ingredienteDetinute.length,
        totalIngrediente: reteta.ingrediente.length
      };
    })
    .filter(reteta => reteta.potrivire > 0) // Afișăm rețetele care au măcar o potrivire
    .filter(reteta => categorieSelectata === 'Toate' || reteta.categorie === categorieSelectata)
    .sort((a, b) => {
      // Prioritate au rețetele unde avem procentajul cel mai mare de ingrediente deținute
      const procentA = a.potrivire / a.totalIngrediente;
      const procentB = b.potrivire / b.totalIngrediente;
      return procentB - procentA;
    });

    setReteteGasite(rezultate);
  }, [ingredienteFrigider, categorieSelectata]);

  const adaugaIngredient = (nume) => {
    const curat = nume.trim().toLowerCase();
    if (curat && !ingredienteFrigider.includes(curat)) {
      setIngredienteFrigider([...ingredienteFrigider, curat]);
    }
    setInputIngredient('');
  };

  const stergeIngredient = (indexDeSters) => {
    setIngredienteFrigider(ingredienteFrigider.filter((_, index) => index !== indexDeSters));
  };

  const categorii = ['Toate', 'Mic Dejun', 'Prânz', 'Cină', 'Desert', 'Snack'];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white antialiased">
      
      {/* Background Decorativ Neon */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-[120px] pointer-events-none z-0" />

      {/* Header Premium */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-xl text-black font-bold">⚡</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CookWithWhatYouHave
              </h1>
              <p className="text-[10px] text-orange-500 font-mono tracking-widest uppercase">Smart AI Engine v2.0</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1.5 rounded-xl">
              Bază date: {reteteData.length}+ Rețete
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Coloana din Stânga: Panoul de Control (Input & Frigider) */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-1 text-white flex items-center gap-2">
              <span>Frigiderul Tău</span>
              <span className="text-xs bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-md font-mono">LIVE</span>
            </h2>
            <p className="text-xs text-slate-400 mb-6">Adaugă ingredientele pe care le ai la îndemână.</p>

            {/* Input stilizat */}
            <div className="relative mb-6">
              <input
                type="text"
                value={inputIngredient}
                onChange={(e) => setInputIngredient(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ',') && (e.preventDefault(), adaugaIngredient(inputIngredient))}
                placeholder="Scrie ingredientul + Enter..."
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 text-sm transition-all placeholder:text-slate-600 text-white"
              />
            </div>

            {/* Tag-uri frigider */}
            {ingredienteFrigider.length > 0 ? (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950/50 rounded-2xl border border-slate-850 min-h-[60px] items-center">
                {ingredienteFrigider.map((ingredient, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-slate-800 to-slate-900 text-slate-200 border border-slate-700/60 px-3 py-1 rounded-xl text-xs font-medium tracking-wide animate-fade-in"
                  >
                    {ingredient}
                    <button 
                      onClick={() => stergeIngredient(index)}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-600 border border-dashed border-slate-800 rounded-2xl">
                Introdu primul ingredient pentru a activa scanarea.
              </div>
            )}
          </div>

          {/* Sugestii Rapide (Click to Add) */}
          <div className="bg-slate-900/20 border border-slate-800/60 rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Ingrediente frecvente</h3>
            <div className="flex flex-wrap gap-2">
              {ingredienteSugerate.map((ing, i) => {
                const dejaAdaugat = ingredienteFrigider.includes(ing);
                return (
                  <button
                    key={i}
                    onClick={() => !dejaAdaugat && adaugaIngredient(ing)}
                    disabled={dejaAdaugat}
                    className={`text-xs px-3 py-2 rounded-xl border transition-all duration-150 ${
                      dejaAdaugat 
                        ? 'bg-slate-900/40 border-slate-850 text-slate-700 cursor-not-allowed line-through' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-orange-500/50 hover:text-orange-400 hover:scale-105'
                    }`}
                  >
                    + {ing}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coloana din Dreapta: Bento Grid de Rețete (2/3 din ecran) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bara de Categorii */}
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none border-b border-slate-900">
            {categorii.map((cat, i) => (
              <button
                key={i}
                onClick={() => setCategorieSelectata(cat)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  categorieSelectata === cat
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold shadow-md shadow-orange-500/10'
                    : 'text-slate-400 hover:text-white bg-slate-900/30 border border-slate-850 hover:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Lista de rețete tip Bento */}
          {reteteGasite.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {reteteGasite.map((reteta) => {
                const areToate = reteta.potrivire === reteta.totalIngrediente;
                return (
                  <div 
                    key={reteta.id} 
                    className={`group bg-slate-900/30 border rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                      areToate 
                        ? 'border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5' 
                        : 'border-slate-850 hover:border-orange-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">
                          {reteta.categorie}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className={areToate ? 'text-emerald-400' : 'text-amber-400'}>
                            {reteta.potrivire}/{reteta.totalIngrediente}
                          </span>
                          <span className="text-slate-600">ingr.</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                        {reteta.titlu}
                      </h3>

                      {/* Chips-uri de ingrediente */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {reteta.ingrediente.map((ing, i) => {
                          const detinut = ingredienteFrigider.includes(ing.toLowerCase());
                          return (
                            <span 
                              key={i} 
                              className={`text-[11px] px-2.5 py-0.5 rounded-lg border font-mono transition-colors ${
                                detinut 
                                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' 
                                  : 'bg-slate-950 border-slate-900 text-slate-600 line-through'
                              }`}
                            >
                              {ing}
                            </span>
                          );
                        })}
                      </div>

                      <p className="text-slate-400 text-xs leading-relaxed bg-slate-950/60 border border-slate-900 p-4 rounded-2xl mb-4">
                        {reteta.instructiuni}
                      </p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-4 flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-mono">⏱️ {reteta.timp}</span>
                      {areToate ? (
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          Gata de gătit ✓
                        </span>
                      ) : (
                        <span className="text-slate-600 font-medium">Lipsesc ingrediente</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty state elegant
            <div className="border border-dashed border-slate-900 rounded-3xl p-16 text-center bg-slate-900/5">
              <span className="text-3xl block mb-3 opacity-60">🍽️</span>
              <p className="text-slate-400 font-bold text-base mb-1">Aștept ingredientele tale</p>
              <p className="text-slate-600 text-xs max-w-xs mx-auto">
                Bifează ingredientele din panoul din stânga sau scrie altele noi. Sistemul îți va arăta instant rețetele compatibile.
              </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}