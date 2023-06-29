// Parameters
let currentScene = 0;

// Define scenes
const scenes = [
  {
    title: "Scene 1",
    description: "This is the first scene."
  },
  {
    title: "Scene 2",
    description: "This is the second scene."
  },
  {
    title: "Scene 3",
    description: "This is the third scene."
  }
];

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
      .on("mouseover", function (d) {
        // Show tooltip after 3 seconds
        setTimeout(() => {
          showTooltip(d);
        }, 3000);
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

  // Function to show the tooltip
  function showTooltip(d) {
    var tooltip = container.append("div")
      .attr("class", "tooltip")
      .style("opacity", 0.8)
      .style("top", (d3.event.pageY + 10) + "px")
      .style("left", (d3.event.pageX + 10) + "px")
      .html(`Make: ${d.Make}<br>Fuel: ${d.Fuel}<br>EngineCylinders: ${d.EngineCylinders}<br>AverageCityMPG: ${d.AverageCityMPG}<br>AverageHighwayMPG: ${d.AverageHighwayMPG}`);
  }

  // Function to hide the tooltip
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
