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
  type ResidentType
} from "./Production";

export type Residents = Record<ResidentType, number>;

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
): Partial<Record<Product, number>> {
  return Object.entries(residents).reduce(
    (overallDemand, [residentType, residentCount]) => {
      const demands = demandMapping[residentType as ResidentType];

      (["basic", "luxury"] as const).forEach((demandType) => {
        const residentDemands =
          demandsToCalculate[residentType as ResidentType]?.[demandType] || [];

        demands[demandType].forEach((demand) => {
          if (residentDemands.includes(demand.product)) {
            overallDemand[demand.product] =
              (overallDemand[demand.product] || 0) +
              demand.amount * residentCount;
          }
        });
      });

      return overallDemand;
    },
    {} as Partial<Record<Product, number>>
  );
}

/**
 * Calculates the needed amount of each production for the given demand.
 */
export function calculateNeededProductions(
  demand: Partial<Record<Product, number>>,
  usesElectricity: any = {}
): { production: Production; amount: number }[] {
  const productions: { production: Production; amount: number }[] = [];

  Object.entries(demand).forEach(([product, demandForProduct]) => {
    // Find the corresponding production
    const currProduction = Productions.find((prod) => {
      return (
        prod.product === product &&
        !(prod.workerType === "Jornaleros" || prod.workerType === "Obreros")
      );
    });

    if (!currProduction) {
      throw new Error(`No production found for product ${product}`);
    }

    productions.concat(
      calculateNumberOfProductions(currProduction, demandForProduct)
    );
  });

  return productions;
}

function calculateNumberOfProductions(
  prod: Production,
  demand: number
): { production: Production; amount: number }[] {
  const productions: { production: Production; amount: number }[] = [];

  // Berechne den Multiplikator durch Elektrizität, falls vorhanden
  // const electricityMultiplier = prod.improvedByElectricity ? 2 : 1;
  const electricityMultiplier = 1;

  // Berechne die benötigte Menge der aktuellen Produktionseinheit (prod)
  const productsPerProduction = prod.amountPerMinute * electricityMultiplier;

  // Berechne, wie viele dieser Produktionen benötigt werden, um die Nachfrage zu decken
  const ownAmount = demand / productsPerProduction;

  // Füge die aktuelle Produktionseinheit und deren benötigte Menge zur Ergebnisliste hinzu
  productions.push({
    production: prod,
    amount: ownAmount
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

export function calculateNeededWorker(neededProductions: any) {
  return {};
}
