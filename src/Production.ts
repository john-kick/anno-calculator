export const products = [
  "Fish",
  "Potato",
  "Schnapps",
  "Wool",
  "Work_clothes",
  "Pigs",
  "Sausages",
  "Grain",
  "Flour",
  "Bread",
  "Tallow",
  "Soap",
  "Hops",
  "Malt",
  "Beer",
  "Beef",
  "Red_peppers",
  "Goulash",
  "Iron",
  "Canned_food",
  "Coal",
  "Steel",
  "Wood",
  "Sewing_machines",
  "Cotton",
  "Cotton_fabric",
  "Furs",
  "Fur_coats",
  "Copper",
  "Zinc",
  "Quartz_sand",
  "Glass",
  "Brass",
  "Spectacles",
  "Caoutchouc",
  "Penny_farthings",
  "Coffee_beans",
  "Coffee",
  "Gold_ore",
  "Gold",
  "Pocket_watches",
  "Filaments",
  "Light_bulbs",
  "Grapes",
  "Champagne",
  "Wood_veneers",
  "Tobacco",
  "Cigars",
  "Sugar_cane",
  "Rum",
  "Sugar",
  "Cocoa",
  "Chocolate",
  "Pearls",
  "Jewerelly",
  "Gramophones",
  "Steam_motors",
  "Chassis",
  "Steam_carriages"
] as const; // <- This ensures it's treated as a readonly tuple

export type Product = (typeof products)[number];

// Investors are not working, these lazy bastards!
export type WorkerType =
  | "Farmer"
  | "Worker"
  | "Artisan"
  | "Engineer"
  | "Jornaleros"
  | "Obreros";

export type Production = {
  name: string;
  product: Product;
  amountPerMinute: number;
  workerType: WorkerType;
  workerAmount: number;
  requires: Production[];
  improvedByElectricity: boolean;
  requiresElectricity: boolean;
};

const Fishery: Production = {
  name: "Fishery",
  product: "Fish",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 25,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const PotatoFarm: Production = {
  name: "Potato Farm",
  product: "Potato",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 20,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const Distillery: Production = {
  name: "Distillery",
  product: "Schnapps",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 50,
  requires: [PotatoFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const SheepFarm: Production = {
  name: "Sheep Farm",
  product: "Wool",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const FrameworkKnitters: Production = {
  name: "Framework Knitters",
  product: "Work_clothes",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 50,
  requires: [SheepFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const PigFarm: Production = {
  name: "Pig Farm",
  product: "Pigs",
  amountPerMinute: 1,
  workerType: "Farmer",
  workerAmount: 30,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const SlaughterHouse: Production = {
  name: "Slaughter House",
  product: "Sausages",
  amountPerMinute: 1,
  workerType: "Worker",
  workerAmount: 50,
  requires: [PigFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const GrainFarm: Production = {
  name: "Grain Farm",
  product: "Grain",
  amountPerMinute: 1,
  workerType: "Farmer",
  workerAmount: 20,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const FlourMill: Production = {
  name: "Flour Mill",
  product: "Flour",
  amountPerMinute: 2,
  workerType: "Farmer",
  workerAmount: 10,
  requires: [GrainFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Bakery: Production = {
  name: "Bakery",
  product: "Bread",
  amountPerMinute: 1,
  workerType: "Worker",
  workerAmount: 50,
  requires: [FlourMill],
  improvedByElectricity: true,
  requiresElectricity: false
};

const RenderingWorks: Production = {
  name: "Rendering Works",
  product: "Tallow",
  amountPerMinute: 1,
  workerType: "Worker",
  workerAmount: 40,
  requires: [PigFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const SoapFactory: Production = {
  name: "Soap Factory",
  product: "Soap",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 50,
  requires: [RenderingWorks],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Malthouse: Production = {
  name: "Malthouse",
  product: "Malt",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 25,
  requires: [GrainFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const HopFarm: Production = {
  name: "Hop Farm",
  product: "Hops",
  amountPerMinute: 2 / 3,
  workerType: "Farmer",
  workerAmount: 20,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const Brewery: Production = {
  name: "Brewery",
  product: "Beer",
  amountPerMinute: 1,
  workerType: "Worker",
  workerAmount: 75,
  requires: [HopFarm, Malthouse],
  improvedByElectricity: true,
  requiresElectricity: false
};

const CattleFarm: Production = {
  name: "Cattle Farm",
  product: "Beef",
  amountPerMinute: 0.5,
  workerType: "Farmer",
  workerAmount: 20,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const RedPepperFarm: Production = {
  name: "Red Pepper Farm",
  product: "Red_peppers",
  amountPerMinute: 0.5,
  workerType: "Farmer",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const ArtisanKitchen: Production = {
  name: "Artisan Kitchen",
  product: "Goulash",
  amountPerMinute: 0.5,
  workerType: "Artisan",
  workerAmount: 75,
  requires: [CattleFarm, RedPepperFarm],
  improvedByElectricity: true,
  requiresElectricity: false
};

const IronMine: Production = {
  name: "Iron Mine",
  product: "Iron",
  amountPerMinute: 4,
  workerType: "Worker",
  workerAmount: 50,
  requires: [],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Cannery: Production = {
  name: "Cannery",
  product: "Canned_food",
  amountPerMinute: 2 / 3,
  workerType: "Artisan",
  workerAmount: 75,
  requires: [IronMine, ArtisanKitchen],
  improvedByElectricity: true,
  requiresElectricity: false
};

const CoalMine: Production = {
  name: "Coal Mine",
  product: "Coal",
  amountPerMinute: 4,
  workerType: "Worker",
  workerAmount: 50,
  requires: [],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Furnace: Production = {
  name: "Furnace",
  product: "Steel",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 100,
  requires: [IronMine, CoalMine],
  improvedByElectricity: true,
  requiresElectricity: false
};

const OldLumberjacksHut: Production = {
  name: "Old Lumberjacks Hut",
  product: "Wood",
  amountPerMinute: 4,
  workerType: "Farmer",
  workerAmount: 5,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const NewLumberjacksHut: Production = {
  name: "New Lumberjacks Hut",
  product: "Wood",
  amountPerMinute: 4,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const SewingMachineFactory: Production = {
  name: "Sewing Machine Factory",
  product: "Sewing_machines",
  amountPerMinute: 2,
  workerType: "Artisan",
  workerAmount: 150,
  requires: [OldLumberjacksHut, Furnace],
  improvedByElectricity: true,
  requiresElectricity: false
};

const CottonPlantation: Production = {
  name: "Cotton Plantation",
  product: "Cotton",
  amountPerMinute: 1,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const CottonMill: Production = {
  name: "Cotton Mill",
  product: "Cotton_fabric",
  amountPerMinute: 2,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [CottonPlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

const HuntingCabin: Production = {
  name: "Hunting Cabin",
  product: "Furs",
  amountPerMinute: 1,
  workerType: "Farmer",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const FurDealer: Production = {
  name: "Fur Dealer",
  product: "Fur_coats",
  amountPerMinute: 2,
  workerType: "Artisan",
  workerAmount: 200,
  requires: [HuntingCabin, CottonMill],
  improvedByElectricity: true,
  requiresElectricity: false
};

const CopperMine: Production = {
  name: "Copper Mine",
  product: "Copper",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 25,
  requires: [],
  improvedByElectricity: true,
  requiresElectricity: false
};

const ZincMine: Production = {
  name: "Zinc Mine",
  product: "Zinc",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 25,
  requires: [],
  improvedByElectricity: true,
  requiresElectricity: false
};

const SandMine: Production = {
  name: "Sand Mine",
  product: "Quartz_sand",
  amountPerMinute: 2,
  workerType: "Worker",
  workerAmount: 25,
  requires: [],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Glassmakers: Production = {
  name: "Glassmakers",
  product: "Glass",
  amountPerMinute: 2,
  workerType: "Artisan",
  workerAmount: 100,
  requires: [SandMine],
  improvedByElectricity: true,
  requiresElectricity: false
};

const BrassSmeltery: Production = {
  name: "Brass Smeltery",
  product: "Brass",
  amountPerMinute: 1,
  workerType: "Worker",
  workerAmount: 25,
  requires: [ZincMine, CopperMine],
  improvedByElectricity: true,
  requiresElectricity: false
};

const SpectacleFactory: Production = {
  name: "Spectacle Factory",
  product: "Spectacles",
  amountPerMinute: 2 / 3,
  workerType: "Engineer",
  workerAmount: 100,
  requires: [Glassmakers, BrassSmeltery],
  improvedByElectricity: true,
  requiresElectricity: false
};

const CaoutchoucPlantation: Production = {
  name: "Caoutchouc Plantation",
  product: "Caoutchouc",
  amountPerMinute: 1,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const BicycleFactory: Production = {
  name: "Bicycle Factory",
  product: "Penny_farthings",
  amountPerMinute: 4,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [Furnace, CaoutchoucPlantation],
  improvedByElectricity: false,
  requiresElectricity: true
};

const CoffeePlantation: Production = {
  name: "Coffee Plantation",
  product: "Coffee_beans",
  amountPerMinute: 1,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const CoffeeRoaster: Production = {
  name: "Coffee Roaster",
  product: "Coffee",
  amountPerMinute: 2,
  workerType: "Obreros",
  workerAmount: 150,
  requires: [CoffeePlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

const GoldMine: Production = {
  name: "Gold Mine",
  product: "Gold_ore",
  amountPerMinute: 0.4,
  workerType: "Obreros",
  workerAmount: 100,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const Goldsmiths: Production = {
  name: "Goldsmiths",
  product: "Gold",
  amountPerMinute: 1,
  workerType: "Engineer",
  workerAmount: 125,
  requires: [CoalMine, GoldMine],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Clockmakers: Production = {
  name: "Clockmakers",
  product: "Pocket_watches",
  amountPerMinute: 4 / 3,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [Glassmakers, Goldsmiths],
  improvedByElectricity: false,
  requiresElectricity: true
};

const FilamentFactory: Production = {
  name: "Filament Factory",
  product: "Filaments",
  amountPerMinute: 1,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [CoalMine],
  improvedByElectricity: true,
  requiresElectricity: false
};

const LightBulbFactory: Production = {
  name: "Light Bulb Factory",
  product: "Light_bulbs",
  amountPerMinute: 1,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [Glassmakers, FilamentFactory],
  improvedByElectricity: true,
  requiresElectricity: false
};

const Vineyard: Production = {
  name: "Vineyard",
  product: "Grapes",
  amountPerMinute: 0.5,
  workerType: "Farmer",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const ChampagneCellar: Production = {
  name: "Champagne Cellar",
  product: "Champagne",
  amountPerMinute: 2,
  workerType: "Artisan",
  workerAmount: 150,
  requires: [Vineyard, Glassmakers],
  improvedByElectricity: true,
  requiresElectricity: false
};

const OldMarquetryWorkshop: Production = {
  name: "Old Marquetry Workshop",
  product: "Wood_veneers",
  amountPerMinute: 1,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [OldLumberjacksHut],
  improvedByElectricity: true,
  requiresElectricity: false
};

const NewMarquetryWorkshop: Production = {
  name: "New Marquetry Workshop",
  product: "Wood_veneers",
  amountPerMinute: 1,
  workerType: "Obreros",
  workerAmount: 100,
  requires: [NewLumberjacksHut],
  improvedByElectricity: false,
  requiresElectricity: false
};

const TobaccoPlantation: Production = {
  name: "Tobacco Plantation",
  product: "Tobacco",
  amountPerMinute: 0.5,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const CigarFactory: Production = {
  name: "Cigar Factory",
  product: "Cigars",
  amountPerMinute: 2,
  workerType: "Obreros",
  workerAmount: 175,
  requires: [NewMarquetryWorkshop, TobaccoPlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

const SugarCanePlantation: Production = {
  name: "Sugar Cane Plantation",
  product: "Sugar_cane",
  amountPerMinute: 2,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const SugarRefinery: Production = {
  name: "Sugar Refinery",
  product: "Sugar",
  amountPerMinute: 2,
  workerType: "Obreros",
  workerAmount: 50,
  requires: [SugarCanePlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

const CocoaPlantation: Production = {
  name: "Cocoa Plantation",
  product: "Cocoa",
  amountPerMinute: 1,
  workerType: "Jornaleros",
  workerAmount: 10,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const ChocolateFactory: Production = {
  name: "Chocolate Factory",
  product: "Chocolate",
  amountPerMinute: 2,
  workerType: "Obreros",
  workerAmount: 100,
  requires: [SugarRefinery, CocoaPlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

const PearlFarm: Production = {
  name: "Pearl Farm",
  product: "Pearls",
  amountPerMinute: 2 / 3,
  workerType: "Jornaleros",
  workerAmount: 50,
  requires: [],
  improvedByElectricity: false,
  requiresElectricity: false
};

const Jewellers: Production = {
  name: "Jewellers",
  product: "Jewerelly",
  amountPerMinute: 2,
  workerType: "Artisan",
  workerAmount: 150,
  requires: [PearlFarm, Goldsmiths],
  improvedByElectricity: true,
  requiresElectricity: false
};

const GramophoneFactory: Production = {
  name: "Gramophone Factory",
  product: "Gramophones",
  amountPerMinute: 1,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [OldMarquetryWorkshop, BrassSmeltery],
  improvedByElectricity: false,
  requiresElectricity: true
};

const Coachmakers: Production = {
  name: "Coachmakers",
  product: "Chassis",
  amountPerMinute: 0.5,
  workerType: "Engineer",
  workerAmount: 150,
  requires: [OldLumberjacksHut, CaoutchoucPlantation],
  improvedByElectricity: true,
  requiresElectricity: false
};

const MotorAssemblyLine: Production = {
  name: "Motor Assembly Line",
  product: "Steam_motors",
  amountPerMinute: 4 / 3,
  workerType: "Engineer",
  workerAmount: 250,
  requires: [Furnace, BrassSmeltery],
  improvedByElectricity: false,
  requiresElectricity: true
};

const CabAssemblyLine: Production = {
  name: "Cab Assembly Line",
  product: "Steam_carriages",
  amountPerMinute: 2,
  workerType: "Engineer",
  workerAmount: 500,
  requires: [Coachmakers, MotorAssemblyLine],
  improvedByElectricity: false,
  requiresElectricity: true
};

const RumDistillery: Production = {
  name: "Rum Distillery",
  product: "Rum",
  amountPerMinute: 2,
  workerType: "Jornaleros",
  workerAmount: 30,
  requires: [OldLumberjacksHut, SugarCanePlantation],
  improvedByElectricity: false,
  requiresElectricity: false
};

/**
 * List of all productions
 */
export const Productions: Production[] = [
  ArtisanKitchen,
  Bakery,
  BicycleFactory,
  BrassSmeltery,
  Brewery,
  CabAssemblyLine,
  Cannery,
  CaoutchoucPlantation,
  CattleFarm,
  ChampagneCellar,
  ChocolateFactory,
  CigarFactory,
  Clockmakers,
  Coachmakers,
  CoalMine,
  CocoaPlantation,
  CoffeePlantation,
  CoffeeRoaster,
  CopperMine,
  CottonMill,
  CottonPlantation,
  Distillery,
  FilamentFactory,
  Fishery,
  FlourMill,
  FrameworkKnitters,
  FurDealer,
  Furnace,
  Glassmakers,
  GoldMine,
  Goldsmiths,
  GrainFarm,
  GramophoneFactory,
  HopFarm,
  HuntingCabin,
  IronMine,
  Jewellers,
  LightBulbFactory,
  OldLumberjacksHut,
  NewLumberjacksHut,
  Malthouse,
  MotorAssemblyLine,
  NewMarquetryWorkshop,
  OldMarquetryWorkshop,
  PearlFarm,
  PigFarm,
  PotatoFarm,
  RedPepperFarm,
  RenderingWorks,
  RumDistillery,
  SandMine,
  SewingMachineFactory,
  SheepFarm,
  SlaughterHouse,
  SoapFactory,
  SpectacleFactory,
  SugarCanePlantation,
  SugarRefinery,
  TobaccoPlantation,
  Vineyard,
  ZincMine
];
