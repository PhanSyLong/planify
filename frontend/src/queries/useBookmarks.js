import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBookmarkedPlans,
  bookmark,
  unbookmark,
} from "../api/plan";

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  // 🔹 Fetch bookmarks
  const bookmarksQuery = useQuery({
    queryKey: ['bookmarks'],
    queryFn: async() => {
      const currentUserId = Number(localStorage.getItem("userId"));
      const res = await getBookmarkedPlans(currentUserId);
      return res.data.result;
    },
    enabled: !!localStorage.getItem("accessToken"), // Wait for auth first
    staleTime: 5 * 60 * 1000,
  });

  // useEffect(() => {
  //   console.log('bookmarks from API:', bookmarksQuery.data);
  // }, [bookmarksQuery.data]);

  // 🔹 Toggle mutation (optimistic)
  const toggleMutation = useMutation({
    mutationFn: ({ planId, isSaved }) => {
      return isSaved ? unbookmark(planId) : bookmark(planId);
    },

    onMutate: async ({ planId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: ['bookmarks'] });

      const previous = queryClient.getQueryData(['bookmarks']);

      // Optimistic update
      queryClient.setQueryData(['bookmarks'], (old = []) => {
        return isSaved ? 
          old.filter(b => b.id !== planId)
          : [...old, {id: planId}];
      });

      return { previous, planId };
    },

    onError: (_err, _vars, context) => {
      if (!context?.previous) return;
      queryClient.setQueryData(['bookmarks'], context.previous);
    },

    onSettled: () => {
      toggleMutation.reset();
    },
  });

  const { isPending } = toggleMutation;

  return {
    bookmarks: bookmarksQuery.data ?? [],
    isBookmarked: (planId) =>
      bookmarksQuery.data?.some(b => b.id === planId) ?? false,

    toggleBookmark: (planId) => {
      const isSaved = queryClient.getQueryData(['bookmarks'])
        ?.some(b => b.id === planId)
      toggleMutation.mutate({ planId, isSaved }, { onSuccess: () => console.log("TOGGLED", planId) });
    },

    isToggling: isPending,
    togglingId: toggleMutation.isPending 
      ? toggleMutation.variables?.planId 
      : null,
  };
};
