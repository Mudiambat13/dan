import api from './api';
import { GeneratePlanInput, PlanDetail, PlanListItem } from '../types';

export const plansService = {
  generate: async (data: GeneratePlanInput): Promise<PlanDetail> => {
    const res = await api.post('/generate-plan/', data);
    return res.data;
  },

  list: async (): Promise<PlanListItem[]> => {
    const res = await api.get('/plans/');
    return res.data.results ?? res.data;
  },

  getById: async (id: number): Promise<PlanDetail> => {
    const res = await api.get(`/plans/${id}/`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/plans/${id}/`);
  },

  toggleFavorite: async (id: number, value: boolean): Promise<void> => {
    await api.patch(`/plans/${id}/`, { is_favorite: value });
  },

  downloadPdf: async (id: number, title: string): Promise<void> => {
    const res = await api.get(`/plans/${id}/pdf/`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan_${title.replace(/\s+/g, '_')}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  },
};
