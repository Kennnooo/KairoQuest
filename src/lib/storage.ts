// Simple user identification and local storage for individual progress
export const getUserId = (): string => {
  let userId = localStorage.getItem('hunter-user-id');
  if (!userId) {
    userId = `hunter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('hunter-user-id', userId);
  }
  return userId;
};

export const getUserData = (key: string) => {
  const userId = getUserId();
  const data = localStorage.getItem(`${userId}-${key}`);
  return data ? JSON.parse(data) : null;
};

export const setUserData = (key: string, value: any) => {
  const userId = getUserId();
  localStorage.setItem(`${userId}-${key}`, JSON.stringify(value));
};

export const removeUserData = (key: string) => {
  const userId = getUserId();
  localStorage.removeItem(`${userId}-${key}`);
};