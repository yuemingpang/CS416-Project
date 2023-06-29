 // Parameters
    let currentScene = 0;

    // Define scenes
    const scenes = [
      {
        title: "Scene 1",
        description: "This is the first scene.",
        // Add other scene-specific properties
      },
      {
        title: "Scene 2",
        description: "This is the second scene.",
        // Add other scene-specific properties
      },
      {
        title: "Scene 3",
        description: "This is the third scene.",
        // Add other scene-specific properties
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

      // Chart code goes here
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
          .attr('r', function (d) { return 2 + +d.EngineCylinders; });

        svg.append('g')
          .attr('transform', "translate(" + margin.left + "," + margin.top + ")")
          .call(yAxis);

        svg.append('g')
          .attr('transform', "translate(" + margin.left + "," + (margin.top + height) + ")")
          .call(xAxis);
      }

      drawChart();
      
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