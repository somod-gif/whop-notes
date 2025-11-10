// src/types/frontend.ts

export interface Note {
  _id?: string;
  title: string;
  content: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}
