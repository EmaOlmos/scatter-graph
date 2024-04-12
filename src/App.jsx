import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const svgRef = useRef();

  useEffect(() => {
    const data = d3.json(url).then((d) => {
      const margin = 50;
      const width = 750;
      const height = 600; // svg scale
      let time = [];

      d.forEach((d) => {
        const splitTime = d.Time.split(":");
        time.push(new Date(1970, 0, 1, 0, splitTime[0], splitTime[1]));
      });
      const years = d.map((e) => e.Year); // map years and time to use in axis
      //const time = d.map((e) => e.Time);

      const yearsMin = d3.min(years); // min and max of both variables
      const yearsMax = d3.max(years);

      const timeMin = d3.min(time);
      const timeMax = d3.max(time);

      // svg config
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "aliceblue");

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity", 0);

      // config scales to make the axises
      const x = d3.scaleLinear(
        [yearsMin - 1, yearsMax + 1],
        [margin, width - margin]
      );

      const y = d3.scaleTime([timeMin, timeMax], [margin, height - margin]);

      const axisBottom = svg
        .append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      const axisLeft = svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")));

      console.log(d);

      svg
        .selectAll("circle")
        .data(d)
        .join("circle")
        .attr("r", 5)
        .attr("fill", (d) => (d.Doping ? "#ADD8E6" : "#FFA500"))
        .attr("cx", (d, i) => x(d.Year))
        .attr("cy", (d, i) => y(time[i]))
        .on("mouseover", (e, d) => {
          tooltip.style("opacity", 0.9);
          tooltip.attr("data-year", d.Year);

          tooltip.html(
            d.Name +
              ": " +
              d.Nationality +
              "<br/>" +
              "Year: " +
              d.Year +
              ", " +
              "Time: " +
              d.Time +
              "<br/>" +
              (d.Doping ? "<br/>" + d.Doping : "")
          );

          tooltip.style("left", e.clientX + 20 + "px");
          tooltip.style("top", e.clientY - 28 + "px");
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0);
        });
    });
  }, []);
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default App;
