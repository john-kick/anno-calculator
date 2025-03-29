import express, { type Request, type Response } from "express";
import path from "node:path";
import {
  calculateDemand,
  calculateNeededProductions,
  calculateNeededWorker,
  type ProductAmounts
} from "./Calculator";
import {
  DemandPerArtisan,
  DemandPerEngineer,
  DemandPerFarmer,
  DemandPerInvestor,
  DemandPerWorker
} from "./Demand";
import {
  Productions,
  products as Products,
  type Product,
  type ResidentType
} from "./Production";

import { config } from "dotenv";
config();

const __dirname = path.resolve();
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/calculate", (req: Request, res: Response) => {
  const demands: Record<ResidentType, { basic: Product[]; luxury: Product[] }> =
    req.body.demands;
  const residents: Record<ResidentType, number> = req.body.residents;
  const usesElectricity: string[] = req.body.usesElectricity;
  const additionalProducts: ProductAmounts = req.body.additionalProducts;

  const demand = calculateDemand(residents, demands);
  const overallDemand = mergeDemands(demand, additionalProducts);
  const neededProductions = calculateNeededProductions(
    overallDemand,
    usesElectricity
  );
  const neededWorker = calculateNeededWorker(neededProductions);

  res.status(200).json({ demand, neededProductions, neededWorker });
});

function mergeDemands(
  demand1: ProductAmounts,
  demand2: ProductAmounts
): ProductAmounts {
  const result: ProductAmounts = { ...demand1 };

  for (const [product, quantity] of Object.entries(demand2)) {
    result[product as Product] = (result[product as Product] || 0) + quantity;
  }

  return result;
}

app.get("/demand", (req, res) => {
  res.status(200).json({
    Farmer: DemandPerFarmer,
    Worker: DemandPerWorker,
    Artisan: DemandPerArtisan,
    Engineer: DemandPerEngineer,
    Investor: DemandPerInvestor
  });
});

app.get("/productions", (req, res) => {
  res.status(200).json(Productions);
});

app.get("/products", (req, res) => {
  res.status(200).json(Products);
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});
