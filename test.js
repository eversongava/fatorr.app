const history = [
    { revenue_rbt: 5000, payroll_fs: 1500 }, // current (m=9)
    { revenue_rbt: 10000, payroll_fs: 4500 },
    { revenue_rbt: 10000, payroll_fs: 2800 },
    { revenue_rbt: 10000, payroll_fs: 2800 },
    { revenue_rbt: 10000, payroll_fs: 3000 },
    { revenue_rbt: 10000, payroll_fs: 3000 },
    { revenue_rbt: 10000, payroll_fs: 1500 },
    { revenue_rbt: 10000, payroll_fs: 2800 },
    { revenue_rbt: 10000, payroll_fs: 2800 },
    { revenue_rbt: 0, payroll_fs: 0 },
    { revenue_rbt: 0, payroll_fs: 0 },
    { revenue_rbt: 0, payroll_fs: 0 },
];

function calc1(history) {
    const active = history.filter(h => h.revenue_rbt > 0 || h.payroll_fs > 0);
    const n = active.length;
    let sumR = active.reduce((s, a) => s + a.revenue_rbt, 0);
    let sumP = active.reduce((s, a) => s + a.payroll_fs, 0);

    let RBT12 = (sumR / n) * 12;
    let Folha12 = (sumP / n) * 12;

    console.log("Method 1 (All Active):");
    console.log("n:", n);
    console.log("SumR:", sumR);
    console.log("RBT12:", RBT12);
    console.log("Folha12:", Folha12);
    console.log("Required PR for current month:");

    const past = history.slice(1).filter(h => h.revenue_rbt > 0 || h.payroll_fs > 0);
    const nPast = past.length;
    const sumPastP = past.reduce((s, a) => s + a.payroll_fs, 0);

    // We want Folha12 target to be RBT12 * 0.29
    const targetFolha12 = RBT12 * 0.29;

    // Folha12 target = (sumPastP + PR) / n * 12
    // targetFolha12 * n / 12 = sumPastP + PR
    const TargetSumP = targetFolha12 * n / 12;
    const PR = TargetSumP - sumPastP;
    console.log("PR:", PR);
}

calc1(history);
