import { useQueries } from "@tanstack/react-query"
import { hydratePlan } from "./planQueries"

export const useHydratedPlans = (plans = []) => {
	return useQueries({
		queries: plans.map(plan => ({
			queryKey: ['plans', plan.id],
			queryFn: () => {
				return hydratePlan(plan.id);
			},
			enabled: !!plan.id,
			staleTime: 5 * 60 * 1000
		})),
	});
};