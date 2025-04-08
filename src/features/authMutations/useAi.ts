import useChatAction from "@/actions/useChatAction";
import { useMutation } from "@tanstack/react-query";

const useAi = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (input: string) => useChatAction(input),
  });
  return {
    askAi: mutate,
    askAiLoading: isPending,
  };
};

export default useAi;
