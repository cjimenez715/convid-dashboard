const lblTotalConfirmed = document.getElementById('confirmed');
const lblTotalDeath = document.getElementById('death');
const lblTotalRecovered = document.getElementById('recovered');
const lblDateUpdate = document.getElementById('date');

window.addEventListener('load', async () => {
  await setSummary()
})
const setSummary = async () => {
  let summary = await getSummary();
  loadSummary(summary);
}

const loadSummary = (summary) => {
  if (summary && !summary.Message) {
    const top10CountriesByDeaths = summary.Countries
      .sort((a, b) => b.TotalDeaths - a.TotalDeaths)
      .splice(0, 10)
      .map(({ Country, TotalDeaths }) => {
        return {
          Country,
          TotalDeaths
        }
      });

    setTotalLabels(summary.Global);
    setPizzaData(summary.Global);
    setLinesData(top10CountriesByDeaths);
    lblDateUpdate.textContent = `Data de atualização: ${formatDates(
      dateFormatter.formatToParts(new Date(summary.Date))
    )}`;
  } else {
    console.log(summary.Message);
  }
}

const setTotalLabels = ({ TotalConfirmed, TotalDeaths, TotalRecovered }) => {
  lblTotalConfirmed.textContent = formatNumbers(TotalConfirmed);
  lblTotalDeath.textContent = formatNumbers(TotalDeaths);
  lblTotalRecovered.textContent = formatNumbers(TotalRecovered);
}

const setPizzaData = ({ NewConfirmed, NewRecovered, NewDeaths }) => {
  new Chart(document.getElementById('pizza'), {
    type: 'pie',
    data: {
      labels: ['Confirmados', 'Recuperados', 'Mortes'],
      datasets: [
        {
          data: [NewConfirmed, NewRecovered, NewDeaths],
          backgroundColor: ["rgb(237, 28, 36)", "rgb(54, 162, 235)", "rgb(255, 207, 95)"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Distribucao de novos casos'
        }
      }
    }
  });
}


const setLinesData = (data) => {
  const countryLabels = data.map(country => country.Country);
  const countriesData = data.map(country => country.TotalDeaths);

  let bar = new Chart(document.getElementById("bars"), {
    type: "bar",
    data: {
      labels: countryLabels,
      datasets: [
        {
          label: "Done",
          data: countriesData,
          backgroundColor: "#0F0F0F",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: true,
          text: "Total de Mortes por Pais - Top 10",
        },
      },

    },
  });

}