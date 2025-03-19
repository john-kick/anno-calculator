import {
  calculateDemand,
  calculateNeededProductions,
  calculateNeededWorker
} from "../src/Calculator";
import { DemandPerFarmer, DemandPerWorker } from "../src/Demand";
import {
  BrassSmeltery,
  CabAssemblyLine,
  CaoutchoucPlantation,
  Coachmakers,
  CoalMine,
  CopperMine,
  Furnace,
  IronMine,
  MotorAssemblyLine,
  NewLumberjacksHut,
  OldLumberjacksHut,
  Productions,
  ZincMine,
  type Product,
  type Production,
  type ResidentType
} from "../src/Production";

describe("calculateDemand", () => {
  const mockResidents = {
    Farmer: 10,
    Worker: 5
  };

  const mockDemandsToCalculate: Partial<
    Record<ResidentType, Record<"basic" | "luxury", Product[]>>
  > = {
    Farmer: { basic: [DemandPerFarmer.basic[0].product], luxury: [] },
    Worker: { basic: [DemandPerWorker.basic[0].product], luxury: [] }
  };

  test("calculates correct demand for given residents", () => {
    const demand = calculateDemand(mockResidents, mockDemandsToCalculate);
    expect(demand[DemandPerFarmer.basic[0].product]).toBe(
      10 * DemandPerFarmer.basic[0].amount
    );
    expect(demand[DemandPerWorker.basic[0].product]).toBe(
      5 * DemandPerWorker.basic[0].amount
    );
  });

  test("returns empty object for no matching demands", () => {
    const demand = calculateDemand(mockResidents, {});
    expect(demand).toEqual({});
  });
});

describe("calculateNeededProductions", () => {
  const simpleDemand: Partial<Record<Product, number>> = { Wood: 20 };

  test("simple production chain", () => {
    const productions = calculateNeededProductions(simpleDemand);

    console.log(productions);
  });

  const complexDemand: Partial<Record<Product, number>> = {
    Steam_carriages: 4
  };
  const expectedCalculatedDemand: { production: Production; amount: number }[] =
    [
      { production: CabAssemblyLine, amount: 2 },
      { production: MotorAssemblyLine, amount: 3 },
      { production: Coachmakers, amount: 8 },
      { production: Furnace, amount: 2 },
      { production: BrassSmeltery, amount: 4 },
      { production: OldLumberjacksHut, amount: 1 },
      { production: CaoutchoucPlantation, amount: 4 },
      { production: IronMine, amount: 1 },
      { production: CoalMine, amount: 1 },
      { production: CopperMine, amount: 2 },
      { production: ZincMine, amount: 2 }
    ];

  test("complex production chain", () => {
    const neededProductions = calculateNeededProductions(complexDemand);

    // Check if the length of the returned result matches the expected length
    expect(neededProductions.length).toBe(expectedCalculatedDemand.length);

    // Check if the returned result matches the expected result
    expectedCalculatedDemand.forEach((expected) => {
      const actual = neededProductions.find(
        (prod) => prod.production.product === expected.production.product
      );

      expect(actual).toBeDefined(); // Make sure the production is found
      expect(actual?.amount).toBe(expected.amount); // Make sure the amount is correct
    });

    // Check for unexpected productions in the actual result
    neededProductions.forEach((actual) => {
      const unexpectedProduction = expectedCalculatedDemand.find(
        (expected) => expected.production.product === actual.production.product
      );

      expect(unexpectedProduction).toBeDefined(); // Ensure no unexpected productions are in the actual result
    });
  });
});

describe("calculateNeededWorker", () => {
  test("returns empty object for no production data", () => {
    const workers = calculateNeededWorker([]);
    expect(workers).toEqual({});
  });

  test("calculates correct worker count", () => {
    const mockProductions = [
      { production: Productions[0], amount: 3 },
      { production: Productions[1], amount: 2 }
    ];

    const workers = calculateNeededWorker(mockProductions);
    expect(Object.keys(workers).length).toBeGreaterThan(0);
  });
});
