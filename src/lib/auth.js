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

export async function resetPassword(email) {
  const redirectUrl = import.meta.env.DEV 
  ? "http://localhost:5173/reset-password"
  : "https://counselconnect-bice.vercel.app/reset-password";

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
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