import { logarUsuario } from "../../infra/usuarios";

export default function Login({ usuario, setUsuario }) {
  async function handleClick(event) {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    let usuario = await logarUsuario(email, senha);
    if (usuario.id) {
      alert("Login Efetuado com Sucesso");
      setUsuario(usuario);
    } else {
      alert(usuario.erro);
    }
  }

  return (
    <div className="container">
      <h3>Login</h3>
      <form>
        <label htmlFor="email">Email:</label>
        <br />
        <input type="email" id="email" />
        <br />
        <label htmlFor="senha">Senha:</label>
        <br />
        <input type="password" id="senha" />
        <br />
        <br />
        <input type="button" value="Login" onClick={handleClick} />
      </form>
    </div>
  );
}
