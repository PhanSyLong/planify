import { useRef } from "react";
import { useQuery } from "@tanstack/react-query"
import { hydratePlan } from "./planQueries"

export const useHydratedPlan = (planId) => {
	return useQuery({
		queryKey: ['plans', planId],
		queryFn: async () => {
			try {
				return await hydratePlan(planId);
			} catch (err) {
				console.log("err", err)
				if (err.response?.status === 400) return null;
				throw err;
			};
		},
		enabled: !!planId,
		staleTime: 5 * 60 * 1000
	});
};