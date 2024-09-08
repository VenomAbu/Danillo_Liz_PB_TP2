import { Outlet, Link } from "react-router-dom";
import BarraLogin from "../componentes/login/BarraLogin";
import { useState } from "react";

export default function Layout() {
  const [usuario, setUsuario] = useState({ id: "", email: "", senha: "" });

  return (
    <div style={{ position: "absolute", left: "10px", top: "10px" }}>
      <BarraLogin usuario={usuario} setUsuario={setUsuario} />
      {usuario.id && ( // Renderização condicional, se usuario for diferente de vazio tudo é renderizado.
        <div>
          <nav>
            <ul>
              <li>
                <Link to={"/"}>Início</Link>
              </li>
              <li>
                <Link to={"/fornecedores"}>Fornecedores</Link>
              </li>
              <li>
                <Link to={"/contatos"}>Contatos</Link>
              </li>
              <li>
                <Link to={"/produtos"}>Produtos</Link>
              </li>
                <li>
                <Link to={"/categorias"}>Categorias</Link>
                </li>
              <li>
                <Link to={"/cotacoes"}>Cotações</Link>
              </li>
            </ul>
          </nav>
          <Outlet />
        </div>
      )}
    </div>
  );
}
