import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function getSession() {
  const session = await auth();
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function getUserId() {
  const session = await auth();
  return session?.user?.id;
}