import puter from "@heyputer/puter.js";

export const signIn = async () => await puter.auth.signIn();

export const signOut = () => puter.auth.signOut();

export const getUser = async () => await puter.auth.getUser();

// get current user
export const getCurrentUser = async () => {
  try {
    return await getUser();
  } catch (error) {
    console.error('Failed to get current user', error);
    return null;
  }
}