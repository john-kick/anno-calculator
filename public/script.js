// script.js
let productions, demandData;

document.addEventListener("DOMContentLoaded", async () => {
  [productions, demandData, products] = await Promise.all([
    fetchData("/productions"),
    fetchData("/demand"),
    fetchData("/products")
  ]);

  populateResidents();
  populateElectricityOptions(productions);
  displayDemandSelection(demandData);
  populateAdditionalProducts();

  document.querySelector("form").onsubmit = handleFormSubmit;

  // Electricity section buttons
  document.getElementById("select-all-electricity").onclick = () =>
    toggleElectricityCheckboxes(true);
  document.getElementById("select-none-electricity").onclick = () =>
    toggleElectricityCheckboxes(false);
  document.getElementById("invert-electricity").onclick =
    invertElectricityCheckboxes;

  // Demand section buttons
  document.getElementById("select-all-basic").onclick = () =>
    toggleDemandCheckboxes("basic", true);
  document.getElementById("select-none-basic").onclick = () =>
    toggleDemandCheckboxes("basic", false);
  document.getElementById("invert-basic").onclick = () =>
    invertDemandCheckboxes("basic");

  document.getElementById("select-all-luxury").onclick = () =>
    toggleDemandCheckboxes("luxury", true);
  document.getElementById("select-none-luxury").onclick = () =>
    toggleDemandCheckboxes("luxury", false);
  document.getElementById("invert-luxury").onclick = () =>
    invertDemandCheckboxes("luxury");
});

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

function populateResidents() {
  const residentsWrapper = document.querySelector("#residents");
  residentList.forEach((resident) =>
    residentsWrapper.appendChild(createInputField(resident, resident))
  );
}

function populateElectricityOptions(productions) {
  const electricityWrapper = document.getElementById("electricity");
  productions
    .filter((prod) => prod.improvedByElectricity)
    .forEach((production) =>
      electricityWrapper.appendChild(
        createCheckbox(toCamelCase(production.name), production.name)
      )
    );
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const residentsData = getResidentsData();
  const usesElectricity = getSelectedElectricityOptions();
  const demandsToCalculate = getDemandSelection();
  const additionalProducts = gatherAdditionalProducts();

  const result = await fetch("/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      residents: residentsData,
      usesElectricity,
      demands: demandsToCalculate,
      additionalProducts
    })
  }).then((res) => res.json());

  displayResults(result);
}

function getResidentsData() {
  return Object.fromEntries(
    residentList.map((resident) => [
      resident,
      Number(document.querySelector(`#${resident}`).value)
    ])
  );
}

function getSelectedElectricityOptions() {
  return Array.from(
    document.querySelectorAll("#electricity div > input:checked")
  ).map((input) => input.name);
}

function getDemandSelection() {
  const demands = initializeDemands();
  populateDemands(demands, "#basic-demands", "basic");
  populateDemands(demands, "#luxury-demands", "luxury");
  return demands;
}

function initializeDemands() {
  return residentList.reduce((acc, resident) => {
    acc[resident] = { basic: [], luxury: [] };
    return acc;
  }, {});
}

function populateDemands(demands, selector, type) {
  document
    .querySelectorAll(`${selector} > td.demand-block`)
    .forEach((demandBlock) => {
      const residentType = demandBlock.getAttribute("data-resident");
      demands[residentType][type] = Array.from(
        demandBlock.querySelectorAll("input:checked")
      ).map((input) => input.getAttribute("data-product"));
    });
}

function populateAdditionalProducts() {
  const addProdWrapper = document.querySelector("#other-products > div");
  products.forEach((product) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("number-input");

    const label = document.createElement("label");
    const input = document.createElement("input");

    label.innerText = replaceUnderscoreWithSpace(product);
    label.for = product;

    input.id = product;
    input.name = product;
    input.value = 0;
    input.type = "number";

    wrapper.append(label, input);
    addProdWrapper.append(wrapper);
  });
}

function gatherAdditionalProducts() {
  const addProducts = {};

  const addProductsElements = document.querySelectorAll(
    "#other-products > div input"
  );
  addProductsElements.forEach((elem) => {
    const val = Number(elem.value);
    if (val > 0) {
      addProducts[elem.name] = Number(val);
    }
  });

  return addProducts;
}

function displayResults(result) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  resultsContainer.appendChild(createDemandTable(result.demand));
  resultsContainer.appendChild(
    createProductionsTable(result.neededProductions)
  );
  resultsContainer.appendChild(createWorkersTable(result.neededWorker));
}

function createDemandTable(demand) {
  const table = createTable(["Product", "Demand (per min)"]);
  Object.entries(demand).forEach(([product, amount]) => {
    table
      .querySelector("tbody")
      .appendChild(
        createRow([replaceUnderscoreWithSpace(product), amount.toFixed(2)])
      );
  });
  return wrapTable("Resident demands", table);
}

function createProductionsTable(productions) {
  const table = createTable(["Production", "Amount", "Electricity"]);
  productions.forEach(({ production, amount, withElectricity }) => {
    table
      .querySelector("tbody")
      .appendChild(
        createRow([
          production.name,
          amount.toFixed(2),
          withElectricity ? "Yes" : "No"
        ])
      );
  });
  return wrapTable("Needed Productions", table);
}

function createWorkersTable(workers) {
  const table = createTable(["Worker Type", "Amount"]);
  Object.entries(workers).forEach(([workerType, amount]) => {
    table
      .querySelector("tbody")
      .appendChild(createRow([workerType, amount.toFixed(2)]));
  });
  return wrapTable("Needed Workers", table);
}

function displayDemandSelection(demandData) {
  const titleRow = document.getElementById("demand-table-title-wrapper");
  const basicRow = document.getElementById("basic-demands");
  const luxuryRow = document.getElementById("luxury-demands");

  Object.entries(demandData).forEach(([resident, demand]) => {
    titleRow.append(createTableHeader(resident));
    basicRow.append(createDemandSection("basic", demand.basic, resident));
    luxuryRow.append(createDemandSection("luxury", demand.luxury, resident));
  });
}

function createTableHeader(resident) {
  const cell = document.createElement("td");
  cell.innerText = `${capitalizeFirstLetter(resident)} demands`;
  return cell;
}

function createDemandSection(type, demands, resident) {
  const wrapper = document.createElement("td");
  wrapper.classList.add("needs-checkbox-list");
  wrapper.setAttribute("data-resident", resident);
  wrapper.setAttribute("data-type", type);
  wrapper.classList.add("demand-block");

  const heading = document.createElement("strong");
  heading.innerText = `${capitalizeFirstLetter(type)} demand`;
  wrapper.append(heading);

  demands.forEach(({ product }) => {
    wrapper.appendChild(
      createCheckbox(
        `${resident}-${type}-${product}`,
        replaceUnderscoreWithSpace(product),
        true,
        [["product", product]]
      )
    );
  });

  return wrapper;
}

function createInputField(id, labelText, value = 0) {
  const input = document.createElement("input");
  input.type = "number";
  input.id = id;
  input.value = value;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = capitalizeFirstLetter(labelText);

  const wrapper = document.createElement("div");
  wrapper.classList.add("number-input");
  wrapper.append(label, input);
  return wrapper;
}

function createCheckbox(id, name, checked = true, data = []) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.name = name;
  checkbox.checked = checked;

  data.forEach(([key, value]) => checkbox.setAttribute(`data-${key}`, value));

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = name;

  const wrapper = document.createElement("div");
  wrapper.append(checkbox, label);
  return wrapper;
}

const residentList = ["Farmer", "Worker", "Artisan", "Engineer", "Investor"];

function toCamelCase(sentence) {
  return sentence
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function replaceUnderscoreWithSpace(str) {
  return str.replace(/_/g, " ");
}

// Toggle all electricity checkboxes
function toggleElectricityCheckboxes(selectAll) {
  document
    .querySelectorAll("#electricity input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.checked = selectAll;
    });
}

// Invert electricity checkbox selections
function invertElectricityCheckboxes() {
  document
    .querySelectorAll("#electricity input[type='checkbox']")
    .forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
    });
}

// Toggle all demand checkboxes for a type (basic/luxury)
function toggleDemandCheckboxes(type, selectAll) {
  document
    .querySelectorAll(`#${type}-demands input[type='checkbox']`)
    .forEach((checkbox) => {
      checkbox.checked = selectAll;
    });
}

// Invert demand checkbox selections for a type (basic/luxury)
function invertDemandCheckboxes(type) {
  document
    .querySelectorAll(`#${type}-demands input[type='checkbox']`)
    .forEach((checkbox) => {
      checkbox.checked = !checkbox.checked;
    });
}

function createTable(headers) {
  const table = document.createElement("table");
  table.classList.add("styled-table"); // Added the new styled class

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerText = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.appendChild(tbody);

  return table;
}

function createRow(cells) {
  const row = document.createElement("tr");
  cells.forEach((cellData) => {
    const cell = document.createElement("td");
    cell.innerText = cellData;
    row.appendChild(cell);
  });
  return row;
}

function wrapTable(title, table) {
  const container = document.createElement("div");
  container.classList.add("table-container"); // Added the new container class

  const heading = document.createElement("h3");
  heading.innerText = title;

  container.appendChild(heading);
  container.appendChild(table);

  return container;
}
