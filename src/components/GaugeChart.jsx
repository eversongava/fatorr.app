import React from 'react';

/**
 * GaugeChart - Visualizador do Fator R atual
 * Acima de 28% = Verde (Ideal: 30%)
 * Entre 24% e 27.9% = Amarelo (Risco Moderado)
 * Abaixo de 24% = Vermelho (Risco Elevado)
 */
export default function GaugeChart({ factorValue }) {
    // Mapeamento visual não-linear do ponteiro para bater com as cores
    // < 24% = Risco (Vermelho) -> visual: 0 a 33% do arco
    // 24% a 27.9% = Atenção (Amarelo) -> visual: 33% a 50% do arco
    // >= 28% = Seguro (Verde) -> visual: 50% a 100% do arco
    let visualPercent = 0;
    if (factorValue < 24) {
        visualPercent = (factorValue / 24) * 33;
    } else if (factorValue < 28) {
        visualPercent = 33 + ((factorValue - 24) / 4) * 17;
    } else {
        const cappedFactor = Math.min(factorValue, 50); // Mapeia >28 Fator R como a 2ª metade do gráfico (até 50%)
        visualPercent = 50 + ((cappedFactor - 28) / 22) * 50;
    }

    // Limita o valor visual realçado entre 0 e 100%
    const clampedValue = Math.min(Math.max(visualPercent, 0), 100);

    // Rotação do ponteiro: 0% = -90deg, 100% = 90deg, 50% = 0deg (centro)
    const rotation = (clampedValue / 100) * 180 - 90;

    let colorClass;
    let indicator;

    if (factorValue >= 28) {
        colorClass = 'text-emerald-500';
        indicator = 'Seguro (Anexo III)';
    } else if (factorValue >= 24) {
        colorClass = 'text-amber-500';
        indicator = 'Atenção (Risco Moderado)';
    } else {
        colorClass = 'text-rose-500';
        indicator = 'Risco (Anexo V)';
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-sm border border-slate-100 relative">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Velocímetro Fator R</h3>

            {/* Container do Semiarco */}
            <div className="relative w-48 h-24 overflow-hidden flex items-end justify-center mb-4">
                {/* Arco de fundo */}
                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-slate-100 box-border"></div>

                {/* Arco Verde (>= 28%) */}
                {/* Como 28% da escala não é linear no aspecto visual de um termômetro, mapeamos:
            0 a 14% = zona vermelha (0 a 25% do arco)
            14 a 28% = zona amarela (25 a 50% do arco)
            > 28% = zona verde (50% a 100% do arco)
            Para fins práticos e visuais simples CSS, usaremos marcações na UI.
        */}

                <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-emerald-500 border-r-emerald-500 border-l-rose-500 border-b-transparent transform rotate-45 opacity-20"></div>

                {/* Ponteiro animado */}
                <div
                    className="absolute bottom-0 w-2 h-24 bg-slate-800 rounded-full origin-bottom transition-all duration-700 ease-out z-10 shadow-lg shadow-slate-900/20"
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rounded-full"></div>
                </div>

                {/* Eixo do ponteiro */}
                <div className="w-8 h-8 bg-slate-900 rounded-full absolute bottom-[-16px] z-20 shadow-inner border-4 border-white"></div>
            </div>

            <div className="text-center mt-2">
                <div className={`text-4xl font-black tracking-tighter ${colorClass} transition-colors duration-700`}>
                    {factorValue.toFixed(2)}%
                </div>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${colorClass} transition-colors duration-700 opacity-80`}>
                    {indicator}
                </p>
            </div>
        </div>
    );
}
