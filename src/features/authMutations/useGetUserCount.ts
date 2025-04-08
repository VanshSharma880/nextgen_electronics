import { getUsersApi } from "@/services/authAPI";
import { useQuery } from "@tanstack/react-query";

const useGetUsers = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersApi,
  });

  return {
    allUsers: data,
    usersLoading: isLoading,
    usersError: error,
  };
};

export default useGetUsers;
