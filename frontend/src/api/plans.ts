import { client } from './client';

export type Plan = {
  id: number;
  title: string;
  description?: string;
  category: string;
  status: 'todo' | 'doing' | 'done';
  dueDate: string;
};

export async function getPlans(params: {
  category?: string;
  startDate?: string;
  endDate?: string;
}) {
  const { data } = await client.get('/plans', { params });
  return data as Plan[];
}

export async function createPlan(payload: Omit<Plan, 'id'>) {
  const { data } = await client.post('/plans', payload);
  return data as Plan;
}

export async function updatePlan(id: number, payload: Partial<Omit<Plan, 'id'>>) {
  const { data } = await client.patch(`/plans/${id}`, payload);
  return data as Plan;
}

export async function deletePlan(id: number) {
  await client.delete(`/plans/${id}`);
}
