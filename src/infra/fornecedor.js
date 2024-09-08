import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Função para adicionar um fornecedor ao Firestore
export const adicionarFornecedor = async (fornecedor) => {
  try {
    const docRef = await addDoc(collection(db, "fornecedores"), fornecedor);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar fornecedor: ", e);
  }
};

// Função para obter todos os fornecedores do Firestore
export const obterFornecedores = async () => {
  const fornecedores = [];
  try {
    const querySnapshot = await getDocs(collection(db, "fornecedores"));
    querySnapshot.forEach((doc) => {
      fornecedores.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Erro ao buscar fornecedores: ", e);
  }
  return fornecedores;
};

// Função para deletar um fornecedor do Firestore
export const deletarFornecedor = async (id) => {
  try {
    await deleteDoc(doc(db, "fornecedores", id));
  } catch (e) {
    console.error("Erro ao deletar fornecedor: ", e);
  }
};

// Função para atualizar um fornecedor no Firestore
export const atualizarFornecedor = async (id, fornecedorAtualizado) => {
  try {
    const fornecedorRef = doc(db, "fornecedores", id);
    await updateDoc(fornecedorRef, fornecedorAtualizado);
  } catch (e) {
    console.error("Erro ao atualizar fornecedor: ", e);
  }
};

