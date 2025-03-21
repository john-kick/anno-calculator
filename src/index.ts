import express, { type Request, type Response } from "express";
import path from "node:path";
import {
  calculateDemand,
  calculateNeededProductions,
  calculateNeededWorker
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

const __dirname = path.resolve();
const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/calculate", (req: Request, res: Response) => {
  const demands: Record<ResidentType, { basic: Product[]; luxury: Product[] }> =
    req.body.demands;
  const residents: Record<ResidentType, number> = req.body.residents;
  const usesElectricity: string[] = req.body.usesElectricity;

  const demand = calculateDemand(residents, demands);
  const neededProductions = calculateNeededProductions(demand, usesElectricity);
  const neededWorker = calculateNeededWorker(neededProductions);

  res.status(200).json({ demand, neededProductions, neededWorker });
});

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

app.listen(PORT, () => {
  console.log(`Server listening at Port ${PORT}`);
});
