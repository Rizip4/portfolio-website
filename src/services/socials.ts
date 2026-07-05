import api from "./api";

export interface Social { id: string; name: string; url: string; icon: string; order: number; createdAt?: string; updatedAt?: string; }
export interface CreateSocialData { name: string; url: string; icon?: string; order?: number; }

export const socialService = {
  async getAll(): Promise<Social[]> {
    const response = await api.get<{ data: Social[] }>("/socials");
    return response.data.data;
  },
  async create(data: CreateSocialData): Promise<Social> {
    const response = await api.post<{ data: Social }>("/socials", data);
    return response.data.data;
  },
  async update(id: string, data: Partial<CreateSocialData>): Promise<Social> {
    const response = await api.put<{ data: Social }>(`/socials/${id}`, data);
    return response.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/socials/${id}`); },
};
