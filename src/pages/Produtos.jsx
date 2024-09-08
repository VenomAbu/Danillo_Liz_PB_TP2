import { useState, useEffect } from 'react';
import { adicionarProduto, obterProdutos, deletarProduto, atualizarProduto } from '../infra/produto';
import { obterCategorias } from '../infra/categoria';
import { contarCotaçõesPorProduto } from '../infra/cotacao';

export default function Produtos() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [produtosComCategorizacao, setProdutosComCategorizacao] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [erros, setErros] = useState({});
  const [editando, setEditando] = useState(null); // Estado para controle de edição

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Obter produtos e categorias do Firestore
        const produtosDoFirestore = await obterProdutos();
        const categoriasDoFirestore = await obterCategorias();

        // Contar cotações e categorizar produtos
        const produtosComCategorizacao = await Promise.all(
          produtosDoFirestore.map(async (produto) => {
            const numeroCotações = await contarCotaçõesPorProduto(produto.id);
            let categorizacao = 'A cotar';
            if (numeroCotações >= 3) categorizacao = 'Cotado';
            else if (numeroCotações > 0) categorizacao = 'Cotando';

            return { ...produto, categorizacao };
          })
        );

        setProdutosComCategorizacao(produtosComCategorizacao);
        setCategorias(categoriasDoFirestore);
      } catch (e) {
        console.error("Erro ao carregar dados: ", e);
      }
    };

    carregarDados();
  }, []);

  const validarFormulario = () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const produto = { nome, descricao, categoria };

      if (editando) {
        // Atualizar produto existente
        await atualizarProduto(editando, produto);
        setProdutosComCategorizacao(produtosComCategorizacao.map(p => 
          p.id === editando ? { id: editando, ...produto, categorizacao: p.categorizacao } : p
        ));
      } else {
        // Adicionar novo produto
        const id = await adicionarProduto(produto);
        if (id) {
          const numeroCotações = await contarCotaçõesPorProduto(id);
          let categorizacao = 'A cotar';
          if (numeroCotações >= 3) categorizacao = 'Cotado';
          else if (numeroCotações > 0) categorizacao = 'Cotando';

          setProdutosComCategorizacao([...produtosComCategorizacao, { id, ...produto, categorizacao }]);
        }
      }

      // Limpar formulário e estado de edição
      setNome('');
      setDescricao('');
      setCategoria('');
      setEditando(null);
    } catch (e) {
      console.error("Erro ao adicionar ou atualizar produto: ", e);
    }
  };

  const handleEdit = (produto) => {
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setCategoria(produto.categoria);
    setEditando(produto.id);
  };

  const handleDelete = async (id) => {
    try {
      await deletarProduto(id);
      setProdutosComCategorizacao(produtosComCategorizacao.filter((produto) => produto.id !== id));
    } catch (e) {
      console.error("Erro ao deletar produto: ", e);
    }
  };

  return (
    <div className='produtoContainer'>
      <h2>{editando ? 'Editar Produto' : 'Adicionar Produto'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ borderColor: erros.nome ? 'red' : '' }}
            required
          />
          {erros.nome && <span style={{ color: 'red' }}>{erros.nome}</span>}
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={{ borderColor: erros.descricao ? 'red' : '' }}
            required
          />
          {erros.descricao && <span style={{ color: 'red' }}>{erros.descricao}</span>}
        </div>
        <div>
          <label>Categoria:</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.nome}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editando ? 'Atualizar' : 'Salvar'}
        </button>
        {editando && (
          <button
            type="button"
            onClick={() => {
              setNome('');
              setDescricao('');
              setCategoria('');
              setEditando(null);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
        )}
      </form>

      <h3>Lista de Produtos</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Categorização</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosComCategorizacao.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.descricao}</td>
              <td>{produto.categoria}</td>
              <td>{produto.categorizacao}</td>
              <td>
                <button
                  onClick={() => handleEdit(produto)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(produto.id)}
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
