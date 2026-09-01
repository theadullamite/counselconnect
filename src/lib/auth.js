import { supabase } from "./supabase";

export async function signUp(email, password, fullName, role) {
  return await supabase.auth.signUp({
    email,
    password,

    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}