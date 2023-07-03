// Parameters
let currentScene = 0;

// Define scenes
const scenes = [
  {
    title: "Scene 1",
    description: "This is the first scene.",
  },
  {
    title: "Scene 2",
    description: "This is the second scene.",
  },
  {
    title: "Scene 3",
    description: "This is the third scene.",
  },
];

//Define annotations
const annotations = [
  {
    note: {
      label: "This is an annotation for Scene 1",
      title: "Annotation Title"
    },
    x: 90,
    y: 90,
    dy: 100,
    dx: 100
  },
  {
    note: {
      label: "This is an annotation for Scene 2",
      title: "Annotation Title"
    },
    x: 100,
    y: 100,
    dy: 90,
    dx: 90
  },
  {
    note: {
      label: "This is an annotation for Scene 3",
      title: "Annotation Title"
    },
    x: 150,
    y: 150,
    dy: 200,
    dx: 200
  },
];

// Function to add annotations to the chart
function addAnnotations(svg, annotations) {
  const makeAnnotations = d3.annotation()
    .type(d3.annotationLabel)
    .annotations(annotations);

  svg.append("g")
    .attr("class", "annotation-group")
    .call(makeAnnotations);
}

// Function to update the display based on the current scene
function updateDisplay() {
  const scene = scenes[currentScene];

  // Clear the container
  d3.select("#container").html("");

  // Repopulate the container with scene-specific elements
  const container = d3.select("#container");

  container
    .append("h2")
    .text(scene.title);

  container
    .append("p")
    .text(scene.description);

  // Add the chart
  const svg = container
    .append("svg")
    .attr("width", "100%")
    .attr("height", "300px");

  //Chart code
  async function drawChart() {
    const data = await d3.csv("https://flunky.github.io/cars2017.csv");
    const width = 200;
    const height = 200;
    const margin = { top: 50, left: 300 };

    const xScale = d3.scaleLog()
      .domain([10, 150])
      .range([0, width]);

    const yScale = d3.scaleLog()
      .domain([10, 150])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale)
      .tickValues([10, 20, 50, 100])
      .tickFormat(d3.format("~s"));

    const yAxis = d3.axisLeft(yScale)
      .tickValues([10, 20, 50, 100])
      .tickFormat(d3.format("~s"));

    svg.append('g')
      .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', function (d) { return xScale(+d.AverageCityMPG); })
      .attr('cy', function (d) { return yScale(+d.AverageHighwayMPG); })
      .attr('r', function (d) { return 2 + +d.EngineCylinders; })
      .on("mouseover", function (event, d) {
        showTooltip(event.pageX, event.pageY, d);
      })
      .on("mouseout", function () {
        hideTooltip();
      });

    svg.append('g')
      .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
      .call(yAxis);

    svg.append('g')
      .attr('transform', "translate(" + margin.left + "," + (margin.top + height) + ")")
      .call(xAxis);
  }

  drawChart();

  //add annotations
  switch (currentScene) {
    case 0:
      addAnnotations(svg, annotations[0]);
      break;
    case 1:
      addAnnotations(svg, annotations[1]);
      break;
    case 2:
      addAnnotations(svg, annotations[2]);
      break;
  }
  
  // Tooltip functions
  function showTooltip(x, y, data) {
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("left", x + "px")
      .style("top", y + "px");

    tooltip.append("p")
      .text("Make: " + data.Make);
    tooltip.append("p")
      .text("Fuel: " + data.Fuel);
    tooltip.append("p")
      .text("Average City MPG: " + data.AverageCityMPG);
    tooltip.append("p")
      .text("Average Highway MPG: " + data.AverageHighwayMPG);
    tooltip.append("p")
      .text("Engine Cylinders: " + data.EngineCylinders);
  }

  function hideTooltip() {
    d3.select(".tooltip").remove();
  }
  

  // Add triggers to change the current scene
  const buttonContainer = container
    .append("div")
    .attr("class", "button-container");

  buttonContainer
    .append("button")
    .attr("class", "button")
    .text("Previous")
    .on("click", () => {
      if (currentScene > 0) {
        currentScene--;
        updateDisplay();
      }
    });

  buttonContainer
    .append("button")
    .attr("class", "button")
    .text("Next")
    .on("click", () => {
      if (currentScene < scenes.length - 1) {
        currentScene++;
        updateDisplay();
      }
    });
}

// Initialize the display
updateDisplay();
