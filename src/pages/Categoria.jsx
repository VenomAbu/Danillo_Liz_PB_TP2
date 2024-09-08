import { useState, useEffect } from "react";
import {
    adicionarCategoria,
    obterCategorias,
    deletarCategoria,
    atualizarCategoria,
} from "../infra/categoria";

export default function Categoria() {
    const [nome, setNome] = useState("");
    const [categorias, setCategorias] = useState([]);
    const [editando, setEditando] = useState(null); // Estado para controle de edição

    // Carrega as categorias ao montar o componente
    useEffect(() => {
        const carregarCategorias = async () => {
            const categoriasDoFirestore = await obterCategorias();
            setCategorias(categoriasDoFirestore);
        };
        carregarCategorias();
    }, []);

    const validarFormulario = () => {
        return nome.trim() !== ""; // Verifica se o campo Nome não está vazio
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        const novaCategoria = { nome };

        try {
            if (editando) {
                // Atualizar categoria existente
                await atualizarCategoria(editando, novaCategoria);
                setCategorias(categorias.map(c =>
                    c.id === editando ? { id: editando, ...novaCategoria } : c
                ));
            } else {
                // Adicionar nova categoria
                const id = await adicionarCategoria(novaCategoria);
                if (id) {
                    setCategorias([...categorias, { id, ...novaCategoria }]);
                }
            }

            // Limpar formulário e estado de edição
            setNome("");
            setEditando(null);
        } catch (e) {
            console.error("Erro ao adicionar ou atualizar categoria: ", e);
        }
    };

    const handleEdit = (categoria) => {
        setNome(categoria.nome);
        setEditando(categoria.id);
    };

    const handleDelete = async (id) => {
        try {
            await deletarCategoria(id);
            setCategorias(categorias.filter((categoria) => categoria.id !== id));
        } catch (e) {
            console.error("Erro ao deletar categoria: ", e);
        }
    };

    return (
        <div className="categoriaContainer">
            <h2>{editando ? 'Editar Categoria' : 'Cadastrar Categoria'}</h2>

            <h3>{editando ? 'Editar Categoria' : 'Cadastrar Categoria'}</h3>

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
                            setEditando(null);
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <h3>Lista de Categorias</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>{categoria.nome}</td>
                            <td>
                                <button
                                    onClick={() => handleEdit(categoria)}
                                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(categoria.id)}
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
