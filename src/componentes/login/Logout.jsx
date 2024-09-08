import { deslogarUsuario } from "../../infra/usuarios";

export default function Logout({ usuario, setUsuario }) {
  async function handleClick(event) {
    let retorno = await deslogarUsuario();
    setUsuario(retorno);
  }

  return (
    <form>
      Login: <b>{usuario.email}</b>
      <input type="button" value="Logout" onClick={handleClick} />
    </form>
  );
}
