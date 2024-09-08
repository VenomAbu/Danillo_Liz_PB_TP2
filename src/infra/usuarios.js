import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../infra/firebase";

export async function logarUsuario(email, senha) {
  let retorno = new Object();
  console.log(`email : ${email} - senha: ${senha}`);
  await signInWithEmailAndPassword(auth, email, senha)
    .then((credenciais) => {
      console.log(credenciais);
      retorno.id = credenciais.user.uid;
      retorno.email = email;
      retorno.senha = senha;
    })
    .catch((error) => {
      console.log(error.code + " = " + error.message);
      retorno.erro = "Login Inválido";
    });
  return retorno;
}

export async function deslogarUsuario() {
  await signOut(auth);
  return { id: "", email: "", senha: "" };
}

export async function criarConta(email, senha) {
  let retorno = new Object();
  await createUserWithEmailAndPassword(auth, email, senha)
    .then((credenciais) => {
      console.log(credenciais);
      retorno.id = credenciais.user.uid;
      retorno.email = email;
      retorno.senha = senha;
    })
    .catch((error) => {
      console.log(error.code + " = " + error.message);
      retorno.erro = "Erro ao criar conta";
    });
  return retorno;
}
