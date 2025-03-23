import type { Product } from "./Production";

export type Demand = {
  product: Product;
  amount: number;
};

export const DemandPerFarmer: {
  basic: Demand[];
  luxury: Demand[];
} = {
  basic: [
    {
      product: "Fish",
      amount: 0.0025
    },
    {
      product: "Work_clothes",
      amount: 0.003076926
    }
  ],
  luxury: [
    {
      product: "Schnapps",
      amount: 0.003333336
    }
  ]
};

export const DemandPerWorker: {
  basic: Demand[];
  luxury: Demand[];
} = {
  basic: [
    {
      product: "Fish",
      amount: 0.0025
    },
    {
      product: "Work_clothes",
      amount: 0.003076926
    },
    {
      product: "Sausages",
      amount: 0.001
    },
    {
      product: "Bread",
      amount: 0.002
    },
    {
      product: "Soap",
      amount: 0.000416667
    }
  ],
  luxury: [
    {
      product: "Schnapps",
      amount: 0.003333336
    },
    {
      product: "Beer",
      amount: 0.00076923
    }
  ]
};

export const DemandPerArtisan: {
  basic: Demand[];
  luxury: Demand[];
} = {
  basic: [
    {
      product: "Sausages",
      amount: 0.001333334
    },
    {
      product: "Bread",
      amount: 0.001212122
    },
    {
      product: "Soap",
      amount: 0.000555556
    },
    {
      product: "Canned_food",
      amount: 0.00034188
    },
    {
      product: "Sewing_machines",
      amount: 0.00095238
    },
    {
      product: "Fur_coats",
      amount: 0.000888889
    }
  ],
  luxury: [
    {
      product: "Beer",
      amount: 0.001025642
    },
    {
      product: "Rum",
      amount: 0.001904762
    }
  ]
};

export const DemandPerEngineer: {
  basic: Demand[];
  luxury: Demand[];
} = {
  basic: [
    {
      product: "Canned_food",
      amount: 0.00051282
    },
    {
      product: "Sewing_machines",
      amount: 0.001428572
    },
    {
      product: "Fur_coats",
      amount: 0.001333334
    },
    {
      product: "Spectacles",
      amount: 0.000222222
    },
    {
      product: "Coffee",
      amount: 0.001176471
    },
    {
      product: "Light_bulbs",
      amount: 0.0003125
    }
  ],
  luxury: [
    {
      product: "Rum",
      amount: 0.002857143
    },
    {
      product: "Penny_farthings",
      amount: 0.000625
    },
    {
      product: "Pocket_watches",
      amount: 0.000241078
    }
  ]
};

export const DemandPerInvestor: {
  basic: Demand[];
  luxury: Demand[];
} = {
  basic: [
    {
      product: "Spectacles",
      amount: 0.000355556
    },
    {
      product: "Coffee",
      amount: 0.001882353
    },
    {
      product: "Light_bulbs",
      amount: 0.0005
    },
    {
      product: "Champagne",
      amount: 0.0004704
    },
    {
      product: "Cigars",
      amount: 0.000444444
    },
    {
      product: "Chocolate",
      amount: 0.001066667
    },
    {
      product: "Steam_carriages",
      amount: 0.000133334
    }
  ],
  luxury: [
    {
      product: "Penny_farthings",
      amount: 0.001
    },
    {
      product: "Pocket_watches",
      amount: 0.000313725
    },
    {
      product: "Jewerelly",
      amount: 0.000421053
    },
    {
      product: "Gramophones",
      amount: 0.00010524
    }
  ]
};
