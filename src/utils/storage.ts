// Tentukan durasi login dalam milidetik
const EXPIRATION_DURATION = 60 * 60 * 1000; 

export const saveAuth = (data: any) => {
  const now = new Date();
  const item = {
    value: data,
    expiry: now.getTime() + EXPIRATION_DURATION, 
  };
  localStorage.setItem("auth", JSON.stringify(item));
};

export const getAuth = () => {
  const dataStr = localStorage.getItem("auth");
  
  if (!dataStr) {
    return null;
  }

  try {
    const item = JSON.parse(dataStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem("auth");
      return null;
    }

    return item.value;
  } catch (error) {
   
    localStorage.removeItem("auth");
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};