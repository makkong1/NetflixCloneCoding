// useAuthenticate.ts
const useAuthenticate = (): boolean => {
  const token = localStorage.getItem("email");
  return !!token;
};

export default useAuthenticate;
