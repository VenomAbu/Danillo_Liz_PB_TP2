import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "./firebase";

// Função para adicionar um produto ao Firestore
export const adicionarProduto = async (produto) => {
  try {
    const docRef = await addDoc(collection(db, "produtos"), produto);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar produto: ", e);
  }
};

// Função para obter todos os produtos do Firestore
export const obterProdutos = async () => {
  const produtos = [];
  try {
    const querySnapshot = await getDocs(collection(db, "produtos"));
    querySnapshot.forEach((doc) => {
      produtos.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Erro ao buscar produtos: ", e);
  }
  return produtos;
};

// Função para deletar um produto do Firestore
export const deletarProduto = async (id) => {
  try {
    await deleteDoc(doc(db, "produtos", id));
  } catch (e) {
    console.error("Erro ao deletar produto: ", e);
  }
};

// Função para atualizar um produto no Firestore
export const atualizarProduto = async (id, produtoAtualizado) => {
  try {
    const produtoRef = doc(db, "produtos", id);
    await updateDoc(produtoRef, produtoAtualizado);
  } catch (e) {
    console.error("Erro ao atualizar produto: ", e);
  }
};
