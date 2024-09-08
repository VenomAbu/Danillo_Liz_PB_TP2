// Função para obter UFs do Brasil usando uma API alternativa
export const obterUfs = async () => {
  try {
    const response = await fetch('https://brasilapi.com.br/api/ibge/uf/v1');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.map((uf) => uf.sigla); // Ajuste conforme a resposta da API
  } catch (e) {
    console.error("Erro ao buscar UFs: ", e.message);
    return []; // Retorna uma lista vazia em caso de erro
  }
};
