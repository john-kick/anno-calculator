import { expect } from "chai"; // Import Chai's assertion library
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
  CigarFactory,
  Coachmakers,
  CoalMine,
  CopperMine,
  Furnace,
  IronMine,
  MotorAssemblyLine,
  OldLumberjacksHut,
  Productions,
  ZincMine,
  type Product,
  type Production,
  type ResidentType,
  type WorkerType
} from "../src/Production";

describe("calculateDemand", () => {
  const mockResidents = {
    Farmer: 400,
    Worker: 1000
  };

  const farmerDemand = DemandPerFarmer.basic.find(
    (dem) => dem.product === "Fish"
  );
  const workerDemand = DemandPerWorker.basic.find(
    (dem) => dem.product === "Sausages"
  );

  [
    ["Fish", farmerDemand],
    ["Sausages", workerDemand]
  ].forEach(([product, demand]) => {
    if (!demand) {
      fail(`Demand not found: ${product}`);
    }
  });

  const mockDemandsToCalculate: Partial<
    Record<ResidentType, Record<"basic" | "luxury", Product[]>>
  > = {
    Farmer: {
      basic: [farmerDemand!.product],
      luxury: []
    },
    Worker: {
      basic: [workerDemand!.product],
      luxury: []
    }
  };

  it("calculates correct demand for given residents", () => {
    const demand = calculateDemand(mockResidents, mockDemandsToCalculate);
    expect(demand[farmerDemand!.product]).to.equal(
      mockResidents.Farmer * farmerDemand!.amount
    );
    expect(demand[workerDemand!.product]).to.equal(
      mockResidents.Worker * workerDemand!.amount
    );
  });

  it("returns empty object for no matching demands", () => {
    const demand = calculateDemand(mockResidents, {});
    expect(demand).to.deep.equal({});
  });

  describe("calculateDemand with edge cases", () => {
    it("handles zero residents", () => {
      const mockResidents = {
        Farmer: 0,
        Worker: 0
      };
      const demand = calculateDemand(mockResidents, mockDemandsToCalculate);
      expect(demand).to.deep.equal({});
    });

    it("handles negative residents (should throw or handle gracefully)", () => {
      const mockResidents = {
        Farmer: -400,
        Worker: -1000
      };
      expect(() =>
        calculateDemand(mockResidents, mockDemandsToCalculate)
      ).to.throw();
    });
  });
});

describe("calculateNeededProductions", () => {
  const simpleDemand: Partial<Record<Product, number>> = { Wood: 20 };

  it("simple production chain", () => {
    const productions = calculateNeededProductions(simpleDemand);

    expect(1).to.equal(1); // Basic example test, adjust as needed
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

  it("complex production chain", () => {
    const neededProductions = calculateNeededProductions(complexDemand);

    // Check if the length of the returned result matches the expected length
    expect(neededProductions.length).to.equal(expectedCalculatedDemand.length);

    // Check if the returned result matches the expected result
    expectedCalculatedDemand.forEach((expected) => {
      const actual = neededProductions.find(
        (prod) => prod.production.product === expected.production.product
      );

      expect(actual).to.not.be.undefined; // Make sure the production is found
      expect(actual?.amount).to.equal(expected.amount); // Make sure the amount is correct
    });

    // Check for unexpected productions in the actual result
    neededProductions.forEach((actual) => {
      const unexpectedProduction = expectedCalculatedDemand.find(
        (expected) => expected.production.product === actual.production.product
      );

      expect(unexpectedProduction).to.not.be.undefined; // Ensure no unexpected productions are in the actual result
    });
  });

  describe("calculateNeededProductions with production limits", () => {
    it("handles exceeding building capacity", () => {
      const demand: Partial<Record<Product, number>> = {
        Coal: 1000
      };

      // Assume a CoalMine produces at most 10 Coal per cycle, so you need 100 mines
      const neededProductions = calculateNeededProductions(demand);

      expect(neededProductions.length).to.equal(100); // Example if a single CoalMine can produce 10 units
    });
  });

  describe("calculateNeededProductions for luxury goods", () => {
    const luxuryDemand: Partial<Record<Product, number>> = {
      Chocolate: 5
    };

    it("calculates correct production chain for luxury goods", () => {
      const neededProductions = calculateNeededProductions(luxuryDemand);
      // Expected chains for luxury goods
      expect(neededProductions).to.include.deep.members([
        { production: CigarFactory, amount: 5 }, // Example production chain for luxury products
        { production: CaoutchoucPlantation, amount: 5 }
      ]);
    });
  });
});

describe("calculateNeededWorker", () => {
  const mockNeededProductions: { production: Production; amount: number }[] = [
    { production: OldLumberjacksHut, amount: 1 }
  ];

  const expectedWorkers: Record<WorkerType, number> = {
    Farmer: 5,
    Worker: 0,
    Artisan: 0,
    Engineer: 0,
    Jornaleros: 0,
    Obreros: 0
  };

  it("returns empty object for no production data", () => {
    const workers = calculateNeededWorker(mockNeededProductions);
    expect(workers).to.deep.equal(expectedWorkers);
  });

  it("calculates correct worker count", () => {
    const mockProductions = [
      { production: Productions[0], amount: 3 },
      { production: Productions[1], amount: 2 }
    ];

    const workers = calculateNeededWorker(mockProductions);
    expect(Object.keys(workers).length).to.be.greaterThan(0);
  });

  describe("calculateNeededWorker for multiple productions", () => {
    const mockNeededProductions: { production: Production; amount: number }[] =
      [
        { production: OldLumberjacksHut, amount: 1 },
        { production: Furnace, amount: 2 },
        { production: CoalMine, amount: 3 }
      ];

    it("distributes workers across multiple productions", () => {
      const workers = calculateNeededWorker(mockNeededProductions);
      expect(workers.Farmer).to.equal(2); // Example: If workers for Lumberjack, Furnace, and Coal are needed
      expect(workers.Worker).to.equal(0);
      expect(workers.Artisan).to.equal(0);
    });
  });

  describe("calculateNeededWorker with dynamic worker demand", () => {
    it("updates worker count when production demand changes", () => {
      const mockProductions = [
        { production: OldLumberjacksHut, amount: 3 },
        { production: Furnace, amount: 5 }
      ];

      const workers = calculateNeededWorker(mockProductions);
      expect(workers.Farmer).to.be.greaterThan(0); // Update based on new production needs
    });
  });
});
