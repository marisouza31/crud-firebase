const db = require('./firebase');

const Agendamentos = {
  create: async (dados) => {
    try {
      const docRef = db.collection("agendamentos").doc();
      await docRef.set(dados);
      return docRef.id;
    } catch (erro) {
      throw new Error("Erro ao criar agendamento: " + erro.message);
    }
  },

  findAll: async () => {
    try {
      const snapshot = await db.collection("agendamentos").get();
      const agendamentos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return agendamentos;
    } catch (erro) {
      throw new Error("Erro ao listar agendamentos: " + erro.message);
    }
  },

  findOne: async (id) => {
    try {
      const docRef = db.collection("agendamentos").doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("Agendamento não encontrado.");
      }
      return { id: doc.id, ...doc.data() };
    } catch (erro) {
      throw new Error("Erro ao buscar agendamento: " + erro.message);
    }
  },

  update: async (id, dados) => {
    try {
      const docRef = db.collection("agendamentos").doc(id);
      await docRef.update(dados);
    } catch (erro) {
      throw new Error("Erro ao atualizar agendamento: " + erro.message);
    }
  },

  delete: async (id) => {
    try {
      const docRef = db.collection("agendamentos").doc(id);
      await docRef.delete();
    } catch (erro) {
      throw new Error("Erro ao excluir agendamento: " + erro.message);
    }
  },
};

module.exports = Agendamentos;
