import {
  DemandPerArtisan,
  DemandPerEngineer,
  DemandPerFarmer,
  DemandPerInvestor,
  DemandPerWorker,
  type Demand
} from "./Demand";
import {
  Productions,
  type Product,
  type Production,
  type ResidentType,
  type WorkerType
} from "./Production";
import { roundTo } from "./util";

export type Residents = Record<ResidentType, number>;

export type ProductionAmountList = {
  production: Production;
  amount: number;
  withElectricity: boolean;
}[];

export type ProductAmounts = Partial<Record<Product, number>>;

const demandMapping: Record<
  ResidentType,
  { basic: Demand[]; luxury: Demand[] }
> = {
  Farmer: DemandPerFarmer,
  Worker: DemandPerWorker,
  Artisan: DemandPerArtisan,
  Engineer: DemandPerEngineer,
  Investor: DemandPerInvestor,
  Jornaleros: { basic: [], luxury: [] },
  Obreros: { basic: [], luxury: [] }
};

/**
 * Calculates the overall demand for given resident counts.
 * @param residents - An object representing the number of each type of resident.
 * @returns An object containing overall demand.
 */
export function calculateDemand(
  residents: Partial<Residents>,
  demandsToCalculate: Partial<
    Record<ResidentType, Record<"basic" | "luxury", Product[]>>
  >
): ProductAmounts {
  return Object.entries(residents).reduce(
    (overallDemand, [residentType, residentCount]) => {
      const demands = demandMapping[residentType as ResidentType];

      (["basic", "luxury"] as const).forEach((demandType) => {
        const residentDemands =
          demandsToCalculate[residentType as ResidentType]?.[demandType] || [];

        demands[demandType].forEach((demand) => {
          if (residentDemands.includes(demand.product)) {
            const newAmount = roundTo(
              (overallDemand[demand.product] || 0) +
                demand.amount * residentCount,
              3
            );

            if (newAmount > 0) {
              overallDemand[demand.product] = newAmount;
            } else {
              delete overallDemand[demand.product];
            }
          }
        });
      });

      return overallDemand;
    },
    {} as ProductAmounts
  );
}

/**
 * Calculates the needed amount of each production for the given demand.
 */
export function calculateNeededProductions(
  demand: ProductAmounts,
  usesElectricity: string[] = []
): ProductionAmountList {
  let productionsForDemand: ProductionAmountList = [];

  Object.entries(demand).forEach(([product, demandForProduct]) => {
    // Find the corresponding production
    const currProduction = Productions.find((prod) => {
      return prod.product === product;
    });

    if (!currProduction) {
      throw new Error(`No production found for product ${product}`);
    }

    const numOfProductions = calculateNumberOfProductions(
      currProduction,
      demandForProduct,
      usesElectricity
    );

    productionsForDemand = combineProductions(
      productionsForDemand,
      numOfProductions
    );
  });

  return productionsForDemand;
}

function combineProductions(
  prods1: ProductionAmountList,
  prods2: ProductionAmountList
): ProductionAmountList {
  prods2.forEach(({ production, amount, withElectricity }) => {
    const existingEntry = prods1.find(({ production: prod }) => {
      return production.name === prod.name;
    });

    if (existingEntry) {
      existingEntry.amount += amount;
    } else {
      prods1.push({ production, amount, withElectricity });
    }
  });

  return prods1;
}

function calculateNumberOfProductions(
  prod: Production,
  demand: number,
  usesElectricity: string[] = []
): ProductionAmountList {
  const productions: ProductionAmountList = [];

  // Berechne den Multiplikator durch Elektrizität, falls vorhanden
  const productionImprovedByElectricity =
    prod.improvedByElectricity && usesElectricity.includes(prod.name);

  const electricityMultiplier = productionImprovedByElectricity ? 2 : 1;

  // Berechne die benötigte Menge der aktuellen Produktionseinheit (prod)
  const productsPerProduction = prod.amountPerMinute * electricityMultiplier;

  // Berechne, wie viele dieser Produktionen benötigt werden, um die Nachfrage zu decken
  const ownAmount = demand / productsPerProduction;

  // Füge die aktuelle Produktionseinheit und deren benötigte Menge zur Ergebnisliste hinzu
  productions.push({
    production: prod,
    amount: ownAmount,
    withElectricity: productionImprovedByElectricity || prod.requiresElectricity
  });

  // Berechne rekursiv die benötigte Menge der Produktionen, die für diese Produktion erforderlich sind
  prod.requires.forEach((req) => {
    // Berechne die benötigte Menge der Vorgängerproduktionen
    const requiredAmount = ownAmount * prod.amountPerMinute;

    // Füge die Ergebnisse der rekursiven Berechnung der benötigten Produktionen hinzu
    productions.push(...calculateNumberOfProductions(req, requiredAmount));
  });

  return productions;
}

export function calculateNeededWorker(
  neededProductions: ProductionAmountList
): Partial<Record<WorkerType, number>> {
  const neededWorkers: Record<WorkerType, number> = {
    Farmer: 0,
    Worker: 0,
    Artisan: 0,
    Engineer: 0,
    Jornaleros: 0,
    Obreros: 0
  };

  // Sum the worker amounts needed for each production
  neededProductions.forEach(({ production, amount }) => {
    neededWorkers[production.workerType] += production.workerAmount * amount;
  });

  // Remove worker types with an amount of 0
  return Object.fromEntries(
    Object.entries(neededWorkers).filter(([_, amount]) => amount > 0)
  );
}
