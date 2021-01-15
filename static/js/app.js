var countries = [];

function getCountries() {
  const url = "/api/countries";
  d3.json(url).then(function(response){
    var resultArray = response.filter(sampleObj => sampleObj.count >= 100);
    countries = resultArray.map(x => x.country)
    // console.log(countries)
  linePlot()
  })
}

function buildPlot() {
  /* data route */
  const url = "/api/moonphases";
  d3.json(url).then(function(response) {
    var resultArray = response.filter(sampleObj => sampleObj.moonphase.toLowerCase() !='undefined');
 
    // console.log(resultArray)

    var trace1 = {
      type: "pie",
      values: resultArray.map(x => x.count),
      labels: resultArray.map(x => x.moonphase)
    };
     
    var data = [trace1];

    var layout = {
      title: "Attacks vs Moon Phase",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      height: 600,
      width: 600
    };

    // console.log(data)
    Plotly.plot("pie", data, layout);
  });
}

function linePlot() {

  var layout = {
    title: "Total Attacks",
    hovermode: 'closest',
    font: {
      family: 'Arial, sans-serif',
      size: 12,
      color: 'black'
    },
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    },
    height: 600,
    width: 1000,
    paper_bgcolor:'rgba(0,0,0,0)',
    plot_bgcolor:'rgba(0,0,0,0)',
    xaxis: {
      title: 'Year',
      titlefont: {
        size: 18
      },
      showgrid: false,
      range: [1820, 2020]
    },
    yaxis: {
      title: 'Number of Attacks',
      titlefont: {
        size: 18
      },
      range: [0, 500000]
    }
  };

  data = [];

  Plotly.newPlot("timeline", data, layout);

  // filtered = test_data.filter(x => x.country == "ITALY")
  // console.log(filtered)
  

  const url = "/api/timeline";
  d3.json(url).then(function(response) {
    // console.log(response)
    var filter = response.filter(x => x.year >=1800)
    var filteredCountries = filter.filter(sampleObj => sampleObj.country !=null);

    for (i=0; i < window.countries.length; i++) {
      country_list = window.countries
      console.log(window.countries[i])
      filtered = filteredCountries.filter(x => x.country == country_list[i])
      // console.log(filtered)
      var trace1 = {
        type: "scatter",
        x: filtered.map(x => x.year),
        y: filtered.map(x => x.count),
        name: country_list[i]
        // group: filteredCountries.map(x => x.country)
      };
      Plotly.addTraces("timeline", trace1) 
    };
    
  });
}

getCountries();
buildPlot();