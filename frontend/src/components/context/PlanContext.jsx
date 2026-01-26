import { createContext, useContext, useState } from "react";

const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [plans, setPlans] = useState([]);

  const addPlan = (plan) => {
    setPlans((prev) => [
      ...prev,
      {
        ...plan,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <PlanContext.Provider value={{ plans, addPlan }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlans = () => useContext(PlanContext);