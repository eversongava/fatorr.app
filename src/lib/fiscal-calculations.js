/**
 * Calcula a estratégia fiscal com base no histórico de Faturamento e Folha.
 * Meta: Atingir Fator R >= 30% (margem de segurança acima dos 28% exigidos).
 * 
 * Regra do Fator R (LC 123/2006):
 * Fator R = (Folha últimos 12 meses) / (Faturamento últimos 12 meses)
 * Se Fator R >= 28%, enquadra-se no Anexo III.
 * 
 * @param {Array} history Array com objetos { month_year, revenue_rbt, payroll_fs } dos últimos 12 meses
 *                        (inclui o mês atual pendente/projetado).
 * @param {Boolean} isNewCompany Flag indicando se a empresa tem menos de 12 meses.
 * @returns {Object} 
 */
export function calculateFiscalStrategy(history, isNewCompany = false) {
    if (!history || history.length === 0) {
        return {
            totalRevenue: 0,
            totalPayroll: 0,
            requiredProLabore: 0,
            currentFactorR: 0,
            projectedFactorR: 0,
            revenueTolerance: 0,
            wasProportionalCalculated: false
        };
    }

    const MINIMUM_WAGE = 1412.00;
    const TARGET_FACTOR = 0.29;

    let rbt12 = 0;
    let folha12 = 0;
    let wasProportionalCalculated = false;

    const currentMonth = history[0];
    const pastHistory = history.slice(1);

    // Meses passados com algum tipo de movimentação
    const activePastMonths = pastHistory.filter(item => Number(item.revenue_rbt || 0) > 0 || Number(item.payroll_fs || 0) > 0);
    const nPast = activePastMonths.length;

    // Total de meses ativos considerando o mês atual na projeção
    let n = nPast + 1;
    if (n > 12) n = 12;

    const sumPastRevenue = activePastMonths.reduce((sum, item) => sum + Number(item.revenue_rbt || 0), 0);
    const sumPastPayroll = activePastMonths.reduce((sum, item) => sum + Number(item.payroll_fs || 0), 0);

    const currentRevenue = Number(currentMonth.revenue_rbt || 0);
    const currentPayroll = Number(currentMonth.payroll_fs || 0);

    const sumActualRev = sumPastRevenue + currentRevenue;
    const sumActualPay = sumPastPayroll + currentPayroll;

    if (isNewCompany && n < 12) {
        // As regras proporcionais da Receita Federal (LC 123/2006)
        // RBT12 = média aritmética da soma de recebimentos passados multiplicada por 12.
        rbt12 = (sumActualRev / n) * 12;
        folha12 = (sumActualPay / n) * 12;
        wasProportionalCalculated = true;
    } else {
        const fullSumPastRevenue = pastHistory.reduce((s, i) => s + Number(i.revenue_rbt || 0), 0);
        const fullSumPastPayroll = pastHistory.reduce((s, i) => s + Number(i.payroll_fs || 0), 0);
        rbt12 = fullSumPastRevenue + currentRevenue;
        folha12 = fullSumPastPayroll + currentPayroll;
    }

    if (rbt12 === 0) {
        return {
            totalRevenue: 0,
            totalPayroll: folha12,
            requiredProLabore: MINIMUM_WAGE, // Mantém o piso de pro labore
            currentFactorR: 0,
            projectedFactorR: 0,
            revenueTolerance: 0,
            wasProportionalCalculated
        };
    }

    // Fator R Realizado (Atual)
    const currentFactorR = (folha12 / rbt12) * 100;

    // Qual é a folha anual necessária para atingir a meta (29%)?
    const targetFolha12 = rbt12 * TARGET_FACTOR;

    let requiredProLabore = 0;

    if (isNewCompany && n < 12) {
        // Isolando currentPayroll para garantir o RBT12 no mês
        // (sumPastPayroll + currentPayroll) / n * 12 = targetFolha12
        const targetSumActualPay = (targetFolha12 * n) / 12;
        requiredProLabore = targetSumActualPay - sumPastPayroll;
    } else {
        const fullSumPastPayroll = pastHistory.reduce((s, i) => s + Number(i.payroll_fs || 0), 0);
        requiredProLabore = targetFolha12 - fullSumPastPayroll;
    }

    if (requiredProLabore < MINIMUM_WAGE) {
        requiredProLabore = MINIMUM_WAGE;
    }

    // Regra Administrativa: O Pró-labore sugerido não pode ultrapassar o teto do faturamento do mês vigente
    if (requiredProLabore > currentRevenue) {
        requiredProLabore = currentRevenue;
    }

    const projectedActualPayrollSum = sumPastPayroll + requiredProLabore;

    let projectedFolha12 = 0;
    if (isNewCompany && n < 12) {
        projectedFolha12 = (projectedActualPayrollSum / n) * 12;
    } else {
        const fullSumPastPayroll = pastHistory.reduce((s, i) => s + Number(i.payroll_fs || 0), 0);
        projectedFolha12 = fullSumPastPayroll + requiredProLabore;
    }

    const projectedFactorR = (projectedFolha12 / rbt12) * 100;
    const maxRbt12ForCurrentPayroll = projectedFolha12 / 0.28;
    const revenueTolerance12 = Math.max(0, maxRbt12ForCurrentPayroll - rbt12);

    // Convertendo a tolerância para a proporção de 1 mês
    const revenueTolerance = isNewCompany && n < 12
        ? (revenueTolerance12 * n) / 12
        : revenueTolerance12;

    return {
        totalRevenue: rbt12,
        totalPayroll: folha12,
        requiredProLabore,
        currentFactorR,
        projectedFactorR,
        revenueTolerance,
        wasProportionalCalculated
    };
}
