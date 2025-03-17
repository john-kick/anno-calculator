import express, { type Request, type Response } from "express";
import path from "node:path";
import { calculateDemand } from "./Calculator";
import {
  DemandPerArtisan,
  DemandPerEngineer,
  DemandPerFarmer,
  DemandPerInvestor,
  DemandPerWorker
} from "./Demand";
import { Productions, products as Products } from "./Production";

const __dirname = path.resolve();
const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/calculate", (req: Request, res: Response) => {
  const {
    demands: demandsToCalculate,
    residents: rawResidents,
    usesElectricity
  } = req.body;

  const residents = {
    farmer: Number(rawResidents.farmer) || 0,
    worker: Number(rawResidents.worker) || 0,
    artisan: Number(rawResidents.artisan) || 0,
    engineer: Number(rawResidents.engineer) || 0,
    investor: Number(rawResidents.investor) || 0
  };

  // If electricity impact needs to be integrated, pass `usesElectricity` to your calculation logic
  const demand = calculateDemand(residents);

  res.status(200).json(demand);
});

app.get("/demand", (req, res) => {
  res.status(200).json({
    farmer: DemandPerFarmer,
    worker: DemandPerWorker,
    artisan: DemandPerArtisan,
    engineer: DemandPerEngineer,
    investor: DemandPerInvestor
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
