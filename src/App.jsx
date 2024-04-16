import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const svgRef = useRef();

  useEffect(() => {
    const data = d3.json(url).then((d) => {
      const margin = 60;
      const width = 800;
      const height = 700; // svg scale
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
        .attr("id", "x-axis")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      const axisLeft = svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .attr("id", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")));

      console.log(d);

      svg
        .selectAll("circle")
        .data(d)
        .join("circle")
        .attr("r", 7)
        .attr("fill", (d) => (d.Doping ? "#ADD8E6" : "#FFA500"))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("cx", (d, i) => x(d.Year))
        .attr("cy", (d, i) => y(time[i]))
        .attr("class", "dot")
        .attr("data-xvalue", (d, i) => d.Year)
        .attr("data-yvalue", (d, i) => time[i])
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

      //title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin - 35)
        .attr("id", "title")
        .attr("text-anchor", "middle")
        .style("font-size", "25px")
        .text("Dopping in Professional Bicycle Racing");

      //subtitle
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin - 15)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .text("35 Fastest times up Alpe d'Huez");

      //legend
      const legendCont = svg.append("g").attr("id", "legend");

      //texts
      legendCont
        .append("text")
        .attr("x", width - margin - 35)
        .attr("y", height / 2)
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .text("No dopping alegations");

      legendCont
        .append("text")
        .attr("x", width - margin - 55)
        .attr("y", height / 2 + 20)
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .text("Riders with dopping alegations");

      //colors
      legendCont
        .append("rect")
        .style("fill", "#FFA500")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", width - margin + 30)
        .attr("y", height / 2 - 8);

      legendCont
        .append("rect")
        .style("fill", "#ADD8E6")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", width - margin + 30)
        .attr("y", height / 2 + 12);
    });
  }, []);
  return (
    <>
      <div className="allWrapper">
        <svg ref={svgRef}></svg>
      </div>
    </>
  );
}

export default App;
