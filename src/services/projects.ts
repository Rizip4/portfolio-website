import api from "./api";

export interface Project {
  id: string; title: string; category: string; description: string;
  accent: string; imageUrl?: string; videoUrl?: string;
  published: boolean; order: number; createdAt: string; updatedAt: string; adminId: string;
}

export interface CreateProjectData {
  title: string; category: string; description: string; accent?: string;
  imageUrl?: string; videoUrl?: string; published?: boolean; order?: number;
}

export const projectService = {
  async getAll(publishedOnly = false): Promise<Project[]> {
    const response = await api.get<{ data: Project[] }>("/projects", { params: { published: publishedOnly } });
    return response.data.data;
  },
  async getById(id: string): Promise<Project> {
    const response = await api.get<{ data: Project }>(`/projects/${id}`);
    return response.data.data;
  },
  async create(data: CreateProjectData): Promise<Project> {
    const response = await api.post<{ data: Project }>("/projects", data);
    return response.data.data;
  },
  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await api.put<{ data: Project }>(`/projects/${id}`, data);
    return response.data.data;
  },
  async delete(id: string): Promise<void> { await api.delete(`/projects/${id}`); },
  async togglePublish(id: string): Promise<Project> {
    const response = await api.patch<{ data: Project }>(`/projects/${id}/publish`);
    return response.data.data;
  },
};
