export const formatCurrency = (val: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

export const formatNum = (val: number): string =>
    new Intl.NumberFormat('en-US').format(Math.round(val));
