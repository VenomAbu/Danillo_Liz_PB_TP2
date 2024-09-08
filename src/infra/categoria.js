import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Função para adicionar uma categoria ao Firestore
export const adicionarCategoria = async (categoria) => {
  try {
    const docRef = await addDoc(collection(db, "categorias"), categoria);
    return docRef.id;
  } catch (e) {
    console.error("Erro ao adicionar categoria: ", e);
  }
};

// Função para obter todas as categorias do Firestore
export const obterCategorias = async () => {
  const categorias = [];
  try {
    const querySnapshot = await getDocs(collection(db, "categorias"));
    querySnapshot.forEach((doc) => {
      categorias.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error("Erro ao buscar categorias: ", e);
  }
  return categorias;
};

// Função para deletar uma categoria do Firestore
export const deletarCategoria = async (id) => {
  try {
    await deleteDoc(doc(db, "categorias", id));
  } catch (e) {
    console.error("Erro ao deletar categoria: ", e);
  }
};

// Função para atualizar uma categoria no Firestore
export const atualizarCategoria = async (id, categoriaAtualizada) => {
  try {
    const categoriaRef = doc(db, "categorias", id);
    await updateDoc(categoriaRef, categoriaAtualizada);
  } catch (e) {
    console.error("Erro ao atualizar categoria: ", e);
  }
};
