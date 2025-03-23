/**
 * Utilitário para trabalhar com localStorage
 * Permite armazenar dados offline e criar um cache local
 */

// Salva dados no localStorage com uma chave específica
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify({
      data,
      timestamp: Date.now(),
    });
    localStorage.setItem(key, serializedData);
    return true;
  } catch {
    return false;
  }
};

// Recupera dados do localStorage com uma chave específica
export const getFromLocalStorage = (key, maxAgeInMinutes = 60) => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return null;

    const { data, timestamp } = JSON.parse(serialized);

    // Verifica se os dados ainda são válidos baseado no tempo máximo definido
    const now = Date.now();
    const ageInMinutes = (now - timestamp) / (1000 * 60);

    if (ageInMinutes > maxAgeInMinutes) {
      // Dados expirados
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

// Remove dados do localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// Limpa todo o localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

// Verifica se o navegador suporta localStorage
export const isLocalStorageAvailable = () => {
  try {
    const test = "__test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Gera um nome de chave consistente para o localStorage baseado nos parâmetros
export const generateCacheKey = (prefix, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join("_");

  return sortedParams ? `${prefix}_${sortedParams}` : prefix;
};
