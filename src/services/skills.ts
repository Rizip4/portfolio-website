import api from "./api";

export interface Skill { id: string; name: string; order: number; createdAt: string; }

export const skillService = {
  async getAll(): Promise<Skill[]> {
    const response = await api.get<{ data: Skill[] }>("/skills");
    return response.data.data;
  },
  async create(name: string, order = 0): Promise<Skill> {
    const response = await api.post<{ data: Skill }>("/skills", { name, order });
    return response.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/skills/${id}`); },
};
