import { Chart } from "frappe-charts/dist/frappe-charts.min.esm";
import { textSpanEnd } from "typescript";

const form = document.getElementById("area-form");

const getArea = async () => {
  const formData = new FormData(form);

  const area_name = formData.get("area");

  const res = await fetch(
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"
  );
  const raw_data = await res.json();

  const data = raw_data.variables[1];

  const data_index = data.valueTexts.findIndex(
    (element) => element == area_name
  );

  return data.values[data_index];
};

const getData = async () => {
  const area = await getArea();
  console.log(area);

  const query_data = {
    query: [
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: [
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021",
          ],
        },
      },
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: [area],
        },
      },
      {
        code: "Tiedot",
        selection: {
          filter: "item",
          values: ["vaesto"],
        },
      },
    ],
    response: {
      format: "json-stat2",
    },
  };

  const res = await fetch(
    "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(query_data),
    }
  );

  const raw_data = await res.json();

  return raw_data;
};

const show_data = async () => {
  const raw_data = await getData();

  const values = raw_data.value;
  let labels = raw_data.dimension.Vuosi.category.label;
  labels = Object.keys(labels);

  const data = {
    labels,
    datasets: [
      {
        name: "Some Values",
        type: "line",
        values,
      },
    ],
  };

  const chart = new Chart("#chart", {
    title: "Chart Name",
    data,
    type: "line",
    height: 450,
    colors: ["#eb5146"],
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  show_data();
});
