import { useQuery } from "@tanstack/react-query"
import { hydratePlan } from "./planQueries"

export const useHydratedPlan = (planId) => {
	return useQuery({
		queryKey: ['plans', planId],
		queryFn: () => {
			return hydratePlan(planId);
		},
		enabled: !!planId,
		staleTime: 5 * 60 * 1000
	});
};