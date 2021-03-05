import React, { useRef, useEffect, useLayoutEffect, useState } from "react";
import {
  sankeyLinkHorizontal,
  sankey,
  sankeyJustify,
  sankeyCenter,
  sankeyLeft,
  sankeyRight
} from "d3-sankey";
import {
  interpolateCool,
  interpolateWarm,
  interpolateRainbow
} from "d3-scale-chromatic";
import { rgb } from "d3-color";
import { select } from "d3-selection";
import { easeLinear } from "d3-ease";
import { scaleOrdinal, schemeCategory10 } from "d3";
import { interpolateZoom } from "d3-interpolate";

export default function Zoom({ dataX }) {
  const svgRef = useRef(null);
  const [size, setSize] = useState({ width: 200, height: 50 });
  const radius = 6;

  const data = [
    /* e */
    [15, 70],
    [20, 78],
    [30, 82],
    [40, 83],
    [50, 81],
    [58, 73],
    [61, 62],
    [61, 54],
    [60, 43],
    [54, 33],
    [44, 29],
    [33, 29],
    [23, 33],
    [17, 43],
    [15, 54],
    [24, 54],
    [33, 54],
    [42, 54],
    [50, 54],

    /* k */
    [85, 6],
    [85, 16],
    [85, 25],
    [85, 34],
    [85, 44],
    [85, 53],
    [85, 62],
    [85, 72],
    [85, 82],
    [118, 29],
    [110, 38],
    [103, 46],
    [97, 53],
    [104, 58],
    [110, 66],
    [116, 74],
    [123, 82],

    /* s */

    [182, 37],
    [175, 30],
    [165, 27],
    [154, 29],
    [147, 37],
    [147, 47],
    [155, 52],
    [164, 55],
    [172, 58],
    [181, 62],
    [183, 71],
    [179, 80],
    [170, 84],
    [160, 84],
    [151, 81],
    [144, 73],

    /* a */
    [248, 75],
    [240, 82],
    [230, 83],
    [220, 82],
    [211, 80],
    [208, 70],
    [208, 60],
    [208, 50],
    [209, 40],
    [206, 30],
    [218, 32],
    [228, 29],
    [238, 28],
    [247, 30],
    [252, 40],
    [247, 50],
    [238, 55],
    [227, 57],
    [217, 59],

    /* d */
    [316, 6],
    [316, 17],
    [316, 28],
    [316, 39],
    [316, 49],
    [316, 60],
    [316, 71],
    [316, 81],

    [308, 35],
    [300, 29],
    [290, 28],
    [280, 33],
    [274, 43],
    [273, 53],
    [273, 63],
    [275, 73],
    [280, 80],
    [290, 83],
    [300, 83],
    [310, 78],

    /* e */
    [340, 70],
    [345, 78],
    [355, 82],
    [365, 83],
    [375, 81],
    [382, 73],
    [387, 62],
    [387, 54],
    [385, 43],
    [379, 33],
    [369, 29],
    [358, 29],
    [348, 33],
    [342, 43],
    [340, 54],
    [349, 54],
    [358, 54],
    [367, 54],
    [375, 54],

    /* s */

    [446, 37],
    [439, 30],
    [429, 27],
    [418, 29],
    [411, 37],
    [411, 47],
    [419, 52],
    [428, 55],
    [436, 58],
    [445, 62],
    [447, 71],
    [443, 80],
    [434, 84],
    [424, 84],
    [415, 81],
    [408, 73],

    /* I  */

    [470, 30],
    [480, 30],
    [490, 30],
    [480, 38],
    [480, 47],
    [480, 56],
    [480, 65],
    [480, 74],
    [480, 82],
    [470, 82],
    [490, 82]
  ];

  useLayoutEffect(() => {
    function updateSize() {
      const iw = window.innerWidth;
      const ih = window.innerHeight;
      const size = {
        width: iw > 265 ? iw - 65 : 200,
        height: ih > 100 ? ih - 50 : 50
      };
      console.log([iw, ih]);
      setSize(size);
      return select(svgRef.current)
        .call(() => transition(size))
        .node();
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (data != null) {
      drawBubles();
    }
  }, [dataX]);

  function drawBubles() {
    select(svgRef.current)
      .select("g.bubles")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", ([x]) => x)
      .attr("cy", ([, y]) => y)
      .attr("r", radius)
      .attr("fill", (d, i) => interpolateRainbow(i / 216));

    /* return select(svgRef.current).call(transition).node(); */
  }

  let currentTransform = [size.width / 2, size.height / 2, size.height];

  function transition(size) {
    const d = data[Math.floor(Math.random() * data.length)];
    const i = interpolateZoom(currentTransform, [...d, radius * 2 + 1]);

    console.log("transition()");
    console.log(currentTransform, [...d, radius * 2 + 1]);
    console.log(size);

    select(svgRef.current)
      .select("g.bubles")
      .transition()
      .delay(500)
      .duration(i.duration)
      .attrTween("transform", () => (t) =>
        createTransform([size.width, size.height])((currentTransform = i(t)))
      )
      .on("end", () => transition(size));
  }

  function createTransform([width, height]) {
    return (params) => transform([...params, width, height]);
  }

  function transform([x, y, r, width, height]) {
    /* console.log("transform()");
    console.log([x, y, r, width, height]); */
    const retval = `
      translate(${width / 2}, ${height / 2})
      scale(${(2 * height) / r})
      translate(${-x}, ${-y})
    `;
    return retval;
  }

  /*
      <text x="5" y="87" style={{ fontSize: 120 }}>
        ɘksɐdɘsɪ
      </text>
*/
  return (
    <svg
      width={size.width}
      height={size.height}
      ref={svgRef}
      style={{ margin: "0px" }}
    >
      <g className="bubles" />
    </svg>
  );
}
