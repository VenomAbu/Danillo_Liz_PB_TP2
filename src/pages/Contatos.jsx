import { useState, useEffect } from "react";
import {
    adicionarContato,
    obterContatos,
    deletarContato,
    atualizarContato,
} from "../infra/contato";
import { obterFornecedores } from "../infra/fornecedor";
import { regexEmail, regexNumerico } from "../infra/Regex";

export default function Contatos() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cargo, setCargo] = useState("");
    const [fornecedor, setFornecedor] = useState("");
    const [fornecedores, setFornecedores] = useState([]);
    const [contatos, setContatos] = useState([]);
    const [erros, setErros] = useState({});
    const [editando, setEditando] = useState(null); // Estado para controle de edição

    // Carrega os contatos e fornecedores ao montar o componente
    useEffect(() => {
        const carregarDados = async () => {
            const contatosDoFirestore = await obterContatos();
            const fornecedoresDoFirestore = await obterFornecedores();
            setContatos(contatosDoFirestore);
            setFornecedores(fornecedoresDoFirestore);
        };
        carregarDados();
    }, []);

    const validarFormulario = () => {
        const novosErros = {};
        if (!regexEmail.test(email)) novosErros.email = "Email inválido";
        if (!regexNumerico.test(telefone))
            novosErros.telefone = "Telefone inválido";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        const novoContato = { nome, email, telefone, cargo, fornecedor };

        try {
            if (editando) {
                // Atualizar contato existente
                await atualizarContato(editando, novoContato);
                setContatos(contatos.map(c => 
                    c.id === editando ? { id: editando, ...novoContato } : c
                ));
            } else {
                // Adicionar novo contato
                const id = await adicionarContato(novoContato);
                if (id) {
                    setContatos([...contatos, { id, ...novoContato }]);
                }
            }

            // Limpar formulário e estado de edição
            setNome("");
            setEmail("");
            setTelefone("");
            setCargo("");
            setFornecedor("");
            setEditando(null);
        } catch (e) {
            console.error("Erro ao adicionar ou atualizar contato: ", e);
        }
    };

    const handleEdit = (contato) => {
        setNome(contato.nome);
        setEmail(contato.email);
        setTelefone(contato.telefone);
        setCargo(contato.cargo);
        setFornecedor(contato.fornecedor);
        setEditando(contato.id);
    };

    const handleDelete = async (id) => {
        try {
            await deletarContato(id);
            setContatos(contatos.filter((contato) => contato.id !== id));
        } catch (e) {
            console.error("Erro ao deletar contato: ", e);
        }
    };

    return (
        <div className="contatoContainer">
            <h2>Contatos</h2>

            <h3>{editando ? 'Editar Contato' : 'Cadastrar Contato'}</h3>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderColor: erros.email ? "red" : "" }}
                        required
                    />
                    {erros.email && (
                        <span style={{ color: "red" }}>{erros.email}</span>
                    )}
                </div>
                <div>
                    <label>Telefone:</label>
                    <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        style={{ borderColor: erros.telefone ? "red" : "" }}
                        required
                    />
                    {erros.telefone && (
                        <span style={{ color: "red" }}>{erros.telefone}</span>
                    )}
                </div>
                <div>
                    <label>Cargo:</label>
                    <input
                        type="text"
                        value={cargo}
                        onChange={(e) => setCargo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Fornecedor:</label>
                    <select
                        value={fornecedor}
                        onChange={(e) => setFornecedor(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {fornecedores.map((forne) => (
                            <option key={forne.id} value={forne.nome}>
                                {forne.nome}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {editando ? 'Atualizar' : 'Salvar'}
                </button>
                {editando && (
                    <button
                        type="button"
                        onClick={() => {
                            setNome("");
                            setEmail("");
                            setTelefone("");
                            setCargo("");
                            setFornecedor("");
                            setEditando(null);
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <h3>Lista de Contatos</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Cargo</th>
                        <th>Fornecedor</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {contatos.map((contato) => (
                        <tr key={contato.id}>
                            <td>{contato.nome}</td>
                            <td>{contato.email}</td>
                            <td>{contato.telefone}</td>
                            <td>{contato.cargo}</td>
                            <td>{contato.fornecedor}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(contato)}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(contato.id)}
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
