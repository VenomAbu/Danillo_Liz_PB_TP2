import { useState, useEffect } from 'react';
import { adicionarFornecedor, obterFornecedores, deletarFornecedor, atualizarFornecedor } from '../infra/fornecedor';
import { obterUfs } from '../infra/uf';
import { regexEmail, regexNumerico } from '../infra/Regex';

export default function Fornecedores() {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cnpj, setCNPJ] = useState('');
  const [uf, setUF] = useState('');
  const [fornecedores, setFornecedores] = useState([]);
  const [erros, setErros] = useState({});
  const [ufList, setUfList] = useState([]);

  // Estados para edição
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEdit, setNomeEdit] = useState('');
  const [enderecoEdit, setEnderecoEdit] = useState('');
  const [telefoneEdit, setTelefoneEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [cnpjEdit, setCNPJEdit] = useState('');
  const [ufEdit, setUFEdit] = useState('');

  useEffect(() => {
    const carregarFornecedores = async () => {
      const fornecedoresDoFirestore = await obterFornecedores();
      setFornecedores(fornecedoresDoFirestore);
    };

    const carregarUfs = async () => {
      try {
        const ufs = await obterUfs();
        setUfList(ufs);
      } catch (error) {
        console.error("Erro ao carregar UFs: ", error.message);
      }
    };

    carregarFornecedores();
    carregarUfs();
  }, []);

  const validarFormulario = (telefone, email, cnpj) => {
    const novosErros = {};
    if (!regexNumerico.test(telefone)) novosErros.telefone = 'Telefone inválido';
    if (!regexEmail.test(email)) novosErros.email = 'Email inválido';
    if (cnpj.length !== 14) novosErros.cnpj = 'CNPJ inválido, deve conter 14 números';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario(telefone, email, cnpj)) return;

    const novoFornecedor = { nome, endereco, telefone, email, cnpj, uf };
    const id = await adicionarFornecedor(novoFornecedor);

    if (id) {
      setFornecedores([...fornecedores, { id, ...novoFornecedor }]);
      setNome('');
      setEndereco('');
      setTelefone('');
      setEmail('');
      setCNPJ('');
      setUF('');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!validarFormulario(telefoneEdit, emailEdit, cnpjEdit)) return;

    const fornecedorAtualizado = { nome: nomeEdit, endereco: enderecoEdit, telefone: telefoneEdit, email: emailEdit, cnpj: cnpjEdit, uf: ufEdit };
    await atualizarFornecedor(editandoId, fornecedorAtualizado);

    setFornecedores(fornecedores.map((f) => (f.id === editandoId ? { id: f.id, ...fornecedorAtualizado } : f)));
    setEditandoId(null);
    setNomeEdit('');
    setEnderecoEdit('');
    setTelefoneEdit('');
    setEmailEdit('');
    setCNPJEdit('');
    setUFEdit('');
  };

  const iniciarEdicao = (fornecedor) => {
    setEditandoId(fornecedor.id);
    setNomeEdit(fornecedor.nome);
    setEnderecoEdit(fornecedor.endereco);
    setTelefoneEdit(fornecedor.telefone);
    setEmailEdit(fornecedor.email);
    setCNPJEdit(fornecedor.cnpj);
    setUFEdit(fornecedor.uf);
  };

  const handleDelete = async (id) => {
    await deletarFornecedor(id);
    setFornecedores(fornecedores.filter((fornecedor) => fornecedor.id !== id));
  };

  return (
    <div className='fornecedorContainer'>
      <h2>Fornecedores</h2>

      <h3>{editandoId ? 'Editar Fornecedor' : 'Cadastrar Fornecedores'}</h3>

      <form onSubmit={editandoId ? handleEdit : handleSubmit}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={editandoId ? nomeEdit : nome}
            onChange={(e) => (editandoId ? setNomeEdit(e.target.value) : setNome(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Endereço:</label>
          <input
            type="text"
            value={editandoId ? enderecoEdit : endereco}
            onChange={(e) => (editandoId ? setEnderecoEdit(e.target.value) : setEndereco(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Telefone:</label>
          <input
            type="tel"
            value={editandoId ? telefoneEdit : telefone}
            onChange={(e) => (editandoId ? setTelefoneEdit(e.target.value) : setTelefone(e.target.value))}
            style={{ borderColor: erros.telefone ? 'red' : '' }}
            required
          />
          {erros.telefone && <span style={{ color: 'red' }}>{erros.telefone}</span>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={editandoId ? emailEdit : email}
            onChange={(e) => (editandoId ? setEmailEdit(e.target.value) : setEmail(e.target.value))}
            style={{ borderColor: erros.email ? 'red' : '' }}
            required
          />
          {erros.email && <span style={{ color: 'red' }}>{erros.email}</span>}
        </div>
        <div>
          <label>CNPJ:</label>
          <input
            type="text"
            value={editandoId ? cnpjEdit : cnpj}
            onChange={(e) => (editandoId ? setCNPJEdit(e.target.value) : setCNPJ(e.target.value))}
            style={{ borderColor: erros.cnpj ? 'red' : '' }}
            required
          />
          {erros.cnpj && <span style={{ color: 'red' }}>{erros.cnpj}</span>}
        </div>
        <div>
          <label>UF:</label>
          <select
            value={editandoId ? ufEdit : uf}
            onChange={(e) => (editandoId ? setUFEdit(e.target.value) : setUF(e.target.value))}
            required
          >
            <option value="">Selecione uma UF</option>
            {ufList.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editandoId ? 'Atualizar' : 'Salvar'}
        </button>
      </form>

      <h3>Lista de Fornecedores</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>CNPJ</th>
            <th>UF</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor, index) => (
            <tr key={index}>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.endereco}</td>
              <td>{fornecedor.telefone}</td>
              <td>{fornecedor.email}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.uf}</td>
              <td>
                <button
                  onClick={() => iniciarEdicao(fornecedor)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(fornecedor.id)}
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
