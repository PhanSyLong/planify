import { createContext, useContext, useEffect, useState } from "react";
import { getAllPlans } from "../api/plan"; 

const PlansContext = createContext();

export function PlansProvider({ children }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
	console.log("Get all plans");
    getAllPlans()
      .then(res => setPlans(res.data.result))
      .catch(err => console.error("Error fetching plans:", err));
  }, []);

  return (
    <PlansContext.Provider value={{ plans }}>
      {children}
    </PlansContext.Provider>
  );
}

export function usePlans() {
  return useContext(PlansContext);
}
