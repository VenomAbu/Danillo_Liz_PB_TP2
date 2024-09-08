import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Função para adicionar um contato ao Firestore
export const adicionarContato = async (contato) => {
  try {
    const docRef = await addDoc(collection(db, "contatos"), contato);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar contato: ", e);
  }
};

// Função para obter todos os contatos do Firestore
export const obterContatos = async () => {
  const contatos = [];
  try {
    const querySnapshot = await getDocs(collection(db, "contatos"));
    querySnapshot.forEach((doc) => {
      contatos.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Erro ao buscar contatos: ", e);
  }
  return contatos;
};

// Função para deletar um contato do Firestore
export const deletarContato = async (id) => {
  try {
    await deleteDoc(doc(db, "contatos", id));
  } catch (e) {
    console.error("Erro ao deletar contato: ", e);
  }
};

// Função para atualizar um contato no Firestore
export const atualizarContato = async (id, contatoAtualizado) => {
  try {
    const contatoRef = doc(db, "contatos", id);
    await updateDoc(contatoRef, contatoAtualizado);
  } catch (e) {
    console.error("Erro ao atualizar contato: ", e);
  }
};
