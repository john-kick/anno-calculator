import {
  DemandPerArtisan,
  DemandPerEngineer,
  DemandPerFarmer,
  DemandPerInvestor,
  DemandPerWorker,
  type Demand
} from "./Demand";
import { type Product } from "./Production";

export type Residents = {
  farmer: number;
  worker: number;
  artisan: number;
  engineer: number;
  investor: number;
};

/**
 * Calculates the overall demand for given resident counts.
 * @param residents - An object representing the number of each type of resident.
 * @returns An object containing overall demand.
 */
export function calculateDemand(residents: Residents) {
  const overallDemand = calculateResidentDemand(residents);

  return {
    overallDemand
  };
}

/**
 * Calculates the demand for products based on the given resident population.
 * @param residents - The number of residents in each category.
 * @returns A partial record of products with their corresponding demand amounts.
 */
function calculateResidentDemand(
  residents: Residents
): Partial<Record<Product, number>> {
  const overallDemand: Partial<Record<Product, number>> = {};

  const residentGroups = [
    { demands: DemandPerFarmer, residents: residents.farmer },
    { demands: DemandPerWorker, residents: residents.worker },
    { demands: DemandPerArtisan, residents: residents.artisan },
    { demands: DemandPerEngineer, residents: residents.engineer },
    { demands: DemandPerInvestor, residents: residents.investor }
  ];

  residentGroups.forEach(({ demands, residents }) => {
    [...demands.basic, ...demands.luxury].forEach((demand: Demand) => {
      overallDemand[demand.product] =
        (overallDemand[demand.product] || 0) + demand.amount * residents;
    });
  });

  return overallDemand;
}
