
const cmbCountry = document.getElementById('cmbCountry');
const dtpBeginDate = document.getElementById('beginDate');
const dtpEndDate = document.getElementById('endDate');
const cmbData = document.getElementById('cmbData');
const btnApply = document.getElementById('btnApply')
const lblConfirmed = document.getElementById('lblConfirmed')
const lblDeaths = document.getElementById('lblDeaths')
const lblRecovered = document.getElementById('lblRecovered')
let myChart;

let selectedCountry = {};
let countriesData = [];
let lastBeginDate = {};
let beginDate = {};
let endDate = {};
let dataSelected = 'Deaths';

window.addEventListener('load', async () => {
  countriesData = await getCountries();
  loadCountries(countriesData);

  dtpBeginDate.addEventListener('change', dtpBeginDateHandler);
  dtpEndDate.addEventListener('change', dtpEndDateHandler);
  cmbData.addEventListener('change', cmdDataHandler);
  btnApply.addEventListener('click', btnApplyClickHandler);
});

const dtpBeginDateHandler = (event) => {
  if (event.target.value) {
    beginDate = new Date(event.target.value);
    lastBeginDate = new Date(beginDate.getTime());
    lastBeginDate.setDate(lastBeginDate.getDate() - 1);
  }
};

const dtpEndDateHandler = (event) => {
  if (event.target.value) {
    endDate = new Date(event.target.value);
  }
};

const cmdDataHandler = event => {
  if (event.target.value) {
    dataSelected = event.target.value;
  }

}

const convertToOption = ({ Country, ISO2 }) => {
  let option = document.createElement("option");
  option.text = `${Country}`;
  option.value = ISO2;
  option.id = ISO2;
  return option;
};

const loadCountries = (countries) => {
  const countriesSorted = countries.sort((a, b) => a.Country.localeCompare(b.Country));
  const options = countriesSorted.map(convertToOption);
  options.forEach((option) => {
    if (option.id === 'BR') {
      option.defaultSelected = true;
      setSelectedCountryByISO2(option.id);
    }
    cmbCountry.appendChild(option);
  });
  cmbCountry.addEventListener("change", selectedCountryHandler);
}

const selectedCountryHandler = (event) => {
  const iso2 = event.target.value;
  setSelectedCountryByISO2(iso2);
};

const setSelectedCountryByISO2 = (iso2) => {
  selectedCountry = countriesData.find((country) => country.ISO2 === iso2);
}

const btnApplyClickHandler = (_) => {
  getSummaryDataByCountryAndDate();
}

const getSummaryDataByCountryAndDate = async () => {
  const result = await getCountriesDataByDataRangeAndSlug(selectedCountry.Slug, lastBeginDate, endDate);

  const endDateData = result.filter((d) => filterByDate(d.Date, endDate));
  const totalEndConfirmed = endDateData.reduce((acc, item) => acc + item.Confirmed, 0);
  const totalEndDeaths = endDateData.reduce((acc, item) => acc + item.Deaths, 0);
  const totalEndRecovered = endDateData.reduce((acc, item) => acc + item.Recovered, 0);

  lblConfirmed.textContent = formatNumbers(totalEndConfirmed);
  lblDeaths.textContent = formatNumbers(totalEndDeaths);
  lblRecovered.textContent = formatNumbers(totalEndRecovered);

  loopDataRange(result);
};

const filterByDate = (date, comparedDate) => {
  const dateAux = new Date(date);
  return (
    dateAux.toISOString().substr(0, 10) === comparedDate.toISOString().substr(0, 10)
  );
};

const loopDataRange = (result) => {

  const totalLinesResult = [];
  const labels = [];

  let currentData = 0;
  let lastData = 0;
  let dataByDate = [];

  let dateAux = new Date(lastBeginDate.getTime());
  dataByDate = result.filter((d) => filterByDate(d.Date, dateAux));
  lastData = dataByDate.reduce((acc, item) => {
    const amount = dataSelected === 'Confirmed' ? item.Confirmed :
      dataSelected === 'Deaths' ? item.Deaths : item.Recovered;
    return acc + amount;
  }, 0);

  while (dateAux < endDate) {
    dateAux.setDate(dateAux.getDate() + 1);

    labels.push(dateAux.toISOString().substr(0, 10));
    dataByDate = result.filter((d) => filterByDate(d.Date, dateAux));
    switch (dataSelected) {
      case 'Confirmed':
        currentData = dataByDate.reduce((acc, item) => acc + item.Confirmed, 0);
        break;
      case 'Deaths':
        currentData = dataByDate.reduce((acc, item) => acc + item.Deaths, 0);
        break;
      case 'Recovered':
        currentData = dataByDate.reduce((acc, item) => acc + item.Recovered, 0);
        break;
      default:
        break;
    }


    totalLinesResult.push(currentData - lastData);
    lastData = currentData;
  }

  const avg = totalLinesResult.reduce((acc, item, _, arr) => {
    return acc + (item / arr.length);
  }, 0);

  const avgArray = Array(totalLinesResult.length).fill(avg);
  loadChartLines(totalLinesResult,
    labels,
    avgArray,
    dataSelected === 'Confirmed' ? 'Confirmados' :
      dataSelected === 'Deaths' ? 'Mortes' : 'Recuperados');
}


const loadChartLines = (data, labels, avg, resultLabel) => {
  var ctx = document.getElementById('lines').getContext('2d');
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          label: `Numeros de ${resultLabel}`,
          borderColor: "rgb(255, 140, 13)",
          backgroundColor: "rgb(255, 140, 13)"
        },
        {
          data: avg,
          label: `Media de ${resultLabel}`,
          borderColor: "rgb(60, 186, 159)",
          backgroundColor: "rgb(60, 186, 159)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Curva diaria de Covid-19",
        },
        layout: {
          padding: {
            left: 100,
            right: 100,
            top: 50,
            bottom: 10,
          },
        },
      },
    },
  });
}