import { client } from './client';

export async function register(username: string, password: string) {
  const { data } = await client.post('/auth/register', { username, password });
  return data as { accessToken: string; user: { id: number; username: string } };
}

export async function login(username: string, password: string) {
  const { data } = await client.post('/auth/login', { username, password });
  return data as { accessToken: string; user: { id: number; username: string } };
}
