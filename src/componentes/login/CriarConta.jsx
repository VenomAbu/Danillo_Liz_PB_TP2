import { criarConta } from "../../infra/usuarios";

export default function CriarConta({setUsuario}) {
  async function handleClick(event) {
    const email = document.getElementById("novoEmail").value;
    const senha = document.getElementById("novaSenha").value;
    const confirma = document.getElementById("confirma").value;
    if (senha === confirma) {
      let usuario = await criarConta(email, senha);
      if (usuario.id) {
        alert("Conta criada com sucesso");
        setUsuario(usuario);
      } else {
        alert(usuario.erro);
      }
    }
  }

  return (
    <div className="container">
      <h3>Cadastro</h3>
      <form>
        <label htmlFor="novoEmail">Email:</label>
        <br />
        <input type="text" id="novoEmail" />
        <br />
        <label htmlFor="novaSenha">Senha:</label>
        <br />
        <input type="password" id="novaSenha" />
        <br />
        <label htmlFor="novaSenha">Confirmar:</label>
        <br />
        <input type="password" id="confirma" />
        <br />
        <br />
        <input type="button" value="Create" onClick={handleClick} />
        <br />
      </form>
    </div>
  );
}
