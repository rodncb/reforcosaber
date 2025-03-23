/**
 * Formata uma data no formato ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY)
 * @param {string} dataStr - String de data no formato ISO ou outro formato
 * @returns {string} Data formatada ou a string original caso ocorra erro
 */
export const formatarData = (dataStr) => {
  try {
    const data = new Date(dataStr);
    return data.toLocaleDateString("pt-BR");
  } catch {
    return dataStr;
  }
};

/**
 * Formata um valor monetário para o formato brasileiro
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Valor formatado como moeda brasileira
 */
export const formatarMoeda = (valor) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
};
