import Wrapper from "../javascripts/fetch-wrapper.js";
import style from "CssFolder/style.css";
import { capitalize, calculateCalories } from "../javascripts/helper.js";
import snackbar from "snackbar";
import "snackbar/src/snackbar.scss";
import AppData from "../javascripts/app-data.js";
import Chart from "chart.js/auto";

const API = new Wrapper(
  "https://firestore.googleapis.com/v1/projects/foodtracker-832b4/databases/(default)/documents/food"
);

const appData = new AppData();
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const list = document.querySelector("#food-list");
const totalCalories = document.querySelector("#total-calories");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  API.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    if (data.error) {
      return snackbar.show("Some data is missing.");
    }
    snackbar.show("Food added successfully.");

    displayEntry(name.value, carbs.value, protein.value, fat.value);

    render();

    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});

const init = () => {
  API.get("/?pageSize=100").then((data) => {
    data.documents?.forEach((doc) => {
      const fields = doc.fields;

      displayEntry(
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
    render();
  });
};

const displayEntry = (name, carbs, protein, fat) => {
  appData.addFood(carbs, protein, fat);
  list.insertAdjacentHTML(
    "beforeend",
    `<li class="card">
          <div>
            <h3 class="name">${capitalize(name)}</h3>
            <div class="calories">${calculateCalories(
              carbs,
              protein,
              fat
            )} calories</div>
            <ul class="macros">
              <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
              <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
              <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
            </ul>
          </div>
        </li>
    `
  );
};

let chartInstance = null;

const renderChart = () => {
  chartInstance?.destroy();

  const context = document.querySelector("#app-chart").getContext("2d");

  chartInstance = new Chart(context, {
    type: "doughnut",
    data: {
      labels: ["Carbs", "Protein", "Fat"],
      datasets: [
        {
          label: "Macronutrients",
          data: [
            appData.getTotalCarbs(),
            appData.getTotalProtein(),
            appData.getTotalFat(),
          ],
          backgroundColor: ["#25AEEE", "#FECD52", "#57D269"],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],

          borderWidth: 3,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
};

const render = () => {
  renderChart();
  totalCalories.textContent = appData.getTotalCalories();
};

init();
