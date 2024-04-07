import { useEffect, useRef } from "react";
import * as d3 from "d3";

function App() {
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

  const svgRef = useRef();

  useEffect(() => {
    const data = d3.json(url).then((d) => {
      const margin = 50;
      const width = 800;
      const height = 600; // svg scale

      const years = d.map((e) => e.Year); // map years and time to use in axis
      const time = d.map((e) => e.Time);

      const yearsMin = d3.min(years); // min and max of both variables
      const yearsMax = d3.max(years);

      const timeMin = d3.min(
        time.map((e) => {
          return e.replace(":", ".");
        })
      );
      const timeMax = d3.max(
        time.map((e) => {
          return e.replace(":", ".");
        })
      );

      // svg config
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "aliceblue");

      // config scales to make the axises
      const x = d3.scaleLinear([yearsMin, yearsMax], [margin, width - margin]);
      const y = d3.scaleLinear([timeMin, timeMax], [margin, height - margin]);

      const axisBottom = svg
        .append("g")
        .attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(x));

      const axisLeft = svg
        .append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(d3.axisLeft(y));
    });
  }, []);
  return (
    <>
      <svg ref={svgRef}></svg>
    </>
  );
}

export default App;
