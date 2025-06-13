export const formatNumber = (num: number, withDecimals = false) => {
  if (withDecimals) {
    return num.toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export const formatFuel = (liters: number) => {
  return `${liters.toFixed(1)} л`;
};

export const formatCurrency = (amount: number) => {
  return `${formatNumber(amount)} ₽`;
};