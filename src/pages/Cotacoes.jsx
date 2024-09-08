// pages/Cotacoes.js
import { useState, useEffect } from 'react';
import { adicionarCotacao, obterCotações, deletarCotacao } from '../infra/cotacao';
import { obterFornecedores } from '../infra/fornecedor';
import { obterProdutos } from '../infra/produto';

export default function Cotacoes() {
  const [produtoId, setProdutoId] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [cotacoes, setCotacoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [filtroProduto, setFiltroProduto] = useState(''); // Novo estado para filtro
  const [erros, setErros] = useState({});

  // Carrega as cotações, produtos e fornecedores ao montar o componente
  useEffect(() => {
    const carregarDados = async () => {
      const cotacoesDoFirestore = await obterCotações();
      const produtosDoFirestore = await obterProdutos();
      const fornecedoresDoFirestore = await obterFornecedores();
      setCotacoes(cotacoesDoFirestore);
      setProdutos(produtosDoFirestore);
      setFornecedores(fornecedoresDoFirestore);
    };
    carregarDados();
  }, []);

  const validarFormulario = () => {
    const novosErros = {};
    if (!produtoId) novosErros.produto = 'Produto é obrigatório';
    if (!fornecedorId) novosErros.fornecedor = 'Fornecedor é obrigatório';
    if (!valor.trim() || isNaN(valor)) novosErros.valor = 'Valor é obrigatório e deve ser numérico';
    if (!data) novosErros.data = 'Data é obrigatória';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const novaCotacao = { produtoId, fornecedorId, valor, data };
    const id = await adicionarCotacao(novaCotacao);

    if (id) {
      setCotacoes([...cotacoes, { id, ...novaCotacao }]);
      setProdutoId('');
      setFornecedorId('');
      setValor('');
      setData('');
    }
  };

  const handleDelete = async (id) => {
    await deletarCotacao(id);
    setCotacoes(cotacoes.filter((cotacao) => cotacao.id !== id));
  };

  // Filtra as cotações baseadas no filtro do produto
  const cotacoesFiltradas = filtroProduto
    ? cotacoes.filter(cotacao => cotacao.produtoId === filtroProduto)
    : cotacoes;

  return (
    <div className='cotacaoContainer'>
      <h2>Cotações</h2>

     <h3>Cadastrar Cotações</h3>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Produto:</label>
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            style={{ borderColor: erros.produto ? 'red' : '' }}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          {erros.produto && <span style={{ color: 'red' }}>{erros.produto}</span>}
        </div>
        <div>
          <label>Fornecedor:</label>
          <select
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
            style={{ borderColor: erros.fornecedor ? 'red' : '' }}
            required
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map((fornecedor) => (
              <option key={fornecedor.id} value={fornecedor.id}>
                {fornecedor.nome}
              </option>
            ))}
          </select>
          {erros.fornecedor && <span style={{ color: 'red' }}>{erros.fornecedor}</span>}
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="text"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            style={{ borderColor: erros.valor ? 'red' : '' }}
            required
          />
          {erros.valor && <span style={{ color: 'red' }}>{erros.valor}</span>}
        </div>
        <div>
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            style={{ borderColor: erros.data ? 'red' : '' }}
            required
          />
          {erros.data && <span style={{ color: 'red' }}>{erros.data}</span>}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Salvar
        </button>
      </form>

      <h3>Lista de Cotações</h3>

        <div>
            <label>Procurar cotações por Produto:</label>
            <select
              value={filtroProduto}
              onChange={(e) => setFiltroProduto(e.target.value)}
            >
              <option value="">Todos os Produtos</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
          </div>
        
      <table border="1">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Fornecedor</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cotacoesFiltradas.map((cotacao, index) => (
            <tr key={index}>
              <td>{produtos.find(p => p.id === cotacao.produtoId)?.nome || 'Desconhecido'}</td>
              <td>{fornecedores.find(f => f.id === cotacao.fornecedorId)?.nome || 'Desconhecido'}</td>
              <td>{cotacao.valor}</td>
              <td>{cotacao.data}</td>
              <td>
                <button
                  onClick={() => handleDelete(cotacao.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
