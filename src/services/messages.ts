import api from "./api";

export interface Message { id: string; name: string; email: string; message: string; read: boolean; createdAt: string; }

export const messageService = {
  async getAll(): Promise<Message[]> {
    const response = await api.get<{ data: Message[] }>("/messages");
    return response.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/messages/${id}`); },
};
