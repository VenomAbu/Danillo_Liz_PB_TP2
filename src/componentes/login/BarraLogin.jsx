import Logout from "./Logout";
import Login from "./Login";
import CriarConta from "./CriarConta";

export default function BarraLogin({ usuario, setUsuario }) {
  if (usuario.id) {
    return <Logout usuario={usuario} setUsuario={setUsuario} />;
  } else {
    return (
    <div>
    <Login usuario={usuario} setUsuario={setUsuario} />
    <CriarConta setUsuario={setUsuario} />
    </div>
    );
  }
}
