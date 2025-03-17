// script.js
document.addEventListener("DOMContentLoaded", async () => {
  const residentsWrapper = document.querySelector("#residents");
  residentList.forEach((resident) =>
    residentsWrapper.appendChild(createInputField(resident, resident))
  );

  const electricityWrapper = document.getElementById("electricity");
  const productions = await (await fetch("/productions")).json();
  productions.forEach((production) => {
    if (production.improvedByElectricity) {
      electricityWrapper.appendChild(
        createCheckbox(toCamelCase(production.name), production.name)
      );
    }
  });

  const demandData = await (await fetch("/demand")).json();
  displayDemandSelection(demandData);

  document.querySelector("form").onsubmit = onFormSubmit;
});

const onFormSubmit = async (event) => {
  event.preventDefault();

  const rawResidents = Object.fromEntries(
    residentList.map((resident) => [
      resident,
      document.querySelector(`#${resident}`).value
    ])
  );

  const usesElectricity = Object.fromEntries(
    productions.map((production) => [
      production,
      document.querySelector(`#${production}`).checked
    ])
  );

  const demandsToCalculate = {};
  document.querySelectorAll(".demand-wrapper").forEach((demandsPerResident) => {
    const [basic, luxury] = demandsPerResident.querySelectorAll(
      ".needs-checkbox-list"
    );
    const basicDemandsToCalculate = {};

    basic.querySelectorAll("div").forEach((row) => {
      const checkbox = row.querySelector("input");
      basicDemandsToCalculate[checkbox.name] = checkbox.checked;
    });

    const luxuryDemandsToCalculate = {};
    luxury.querySelectorAll("div").forEach((row) => {
      const checkbox = row.querySelector("input");
      luxuryDemandsToCalculate[checkbox.name] = checkbox.checked;
    });

    const residentName = demandsPerResident
      .querySelector("h4")
      .innerText.split(" ")[0];
    demandsToCalculate[residentName] = {
      basic: basicDemandsToCalculate,
      luxury: luxuryDemandsToCalculate
    };
  });

  console.log(demandsToCalculate);

  const response = await fetch("/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      residents: rawResidents,
      usesElectricity,
      demands: demandsToCalculate
    })
  });

  const result = await response.json();
  document.getElementById("results").innerHTML = `<pre>${JSON.stringify(
    result,
    null,
    2
  )}</pre>`;
};

const createDemandSection = (title, demands) => {
  const wrapper = document.createElement("td");
  wrapper.classList.add("needs-checkbox-list");

  const heading = document.createElement("strong");
  heading.innerText = title;
  wrapper.append(heading);

  demands.forEach(({ product }) => {
    wrapper.appendChild(createCheckbox(`${title}-${product}`, product));
  });

  return wrapper;
};

const displayDemandSelection = (demandData) => {
  const titleRow = document.getElementById("demand-table-title-wrapper");
  const basicRow = document.getElementById("basic-demands");
  const luxuryRow = document.getElementById("luxury-demands");

  Object.entries(demandData).forEach(([resident, demand]) => {
    const residentLabel = document.createElement("td");
    residentLabel.innerText = `${capitalizeFirstLetter(resident)} demands`;
    titleRow.append(residentLabel);

    basicRow.append(createDemandSection("Basic demand", demand.basic));
    luxuryRow.append(createDemandSection("Luxury demand", demand.luxury));
  });
};

const createInputField = (id, labelText, value = 0) => {
  const input = document.createElement("input");
  input.type = "number";
  input.id = id;
  input.value = value;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = capitalizeFirstLetter(labelText);
  label.classList.add("worker-label");

  const wrapper = document.createElement("div");
  wrapper.append(label, input);
  return wrapper;
};

const createCheckbox = (id, name, checked = true) => {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.name = id;
  checkbox.checked = checked;

  const label = document.createElement("label");
  label.htmlFor = id;
  label.innerText = replaceUnderscoreWithSpace(name);

  const wrapper = document.createElement("div");
  wrapper.append(checkbox, label);
  return wrapper;
};

const residentList = ["farmer", "worker", "artisan", "engineer", "investor"];

function toCamelCase(sentence) {
  return sentence
    .toLowerCase() // Lowercase the entire sentence first
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()) // Capitalize letters after spaces or special characters
    .replace(/^\w/, (char) => char.toLowerCase()); // Ensure the first letter is lowercase
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function replaceUnderscoreWithSpace(str) {
  return str.replace("_", " ");
}
