import React, { Component, Fragment } from "react";
import * as d3base from "d3";
import { scaleLinear } from "d3-scale";
import { interpolateCool, interpolateWarm } from "d3-scale-chromatic";
import { rgb } from "d3-color";
import { sankeyLinkHorizontal, sankey, sankeyJustify } from "d3-sankey";

const d3 = Object.assign(d3base, { sankey, sankeyJustify });

const colors = interpolateWarm;

const Rect = ({
  index,
  x0,
  x1,
  y0,
  y1,
  name,
  value,
  length,
  swidth,
  sheight,
  colors
}) => {
  return (
    <Fragment>
      <rect
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        fill={colors(index / length)}
        data-index={index}
      />
      <text
        x={x0 < swidth / 2 ? x1 + 6 : x0 - 6}
        y={(y1 + y0) / 2}
        style={{
          fill: rgb(colors(index / length)).darker(),
          alignmentBaseline: "middle",
          fontSize: 9,
          textAnchor: x0 < swidth / 2 ? "start" : "end",
          pointerEvents: "none",
          userSelect: "none"
        }}
      >
        {name}
      </text>
    </Fragment>
  );
};

const Link = ({ data, width, length, colors }) => {
  const link = sankeyLinkHorizontal();

  return (
    <Fragment>
      <defs>
        <linearGradient
          id={`gradient-${data.index}`}
          gradientUnits="userSpaceOnUse"
          x1={data.source.x1}
          x2={data.target.x0}
        >
          <stop offset="0" stopColor={colors(data.source.index / length)} />
          <stop offset="100%" stopColor={colors(data.target.index / length)} />
        </linearGradient>
      </defs>
      <path
        d={link(data)}
        fill={"none"}
        stroke={`url(#gradient-${data.index})`}
        strokeOpacity={0.5}
        strokeWidth={width}
      />
    </Fragment>
  );
};

class Own extends Component {
  constructor(props) {
    super(props);

    this.sankeyimpl = d3
      .sankey()
      .nodeAlign(d3.sankeyJustify)
      .nodeWidth(10)
      .nodePadding(10)
      .extent([
        [0, 0],
        [props.width, props.height]
      ]);
  }

  render() {
    if (
      this.props &&
      this.props.data &&
      this.props.data.nodes.length > 0 &&
      this.props.data.links.length > 0
    ) {
      const { links, nodes } = this.sankeyimpl(this.props.data);
      const link = sankeyLinkHorizontal();
      const width = this.props.width;
      const height = this.props.height;

      return (
        <svg width={width} height={height}>
          <g>
            {links.map((d, i) => (
              <Link
                key={d.index}
                data={d}
                width={d.width}
                length={nodes.length}
                colors={colors}
              />
            ))}
          </g>
          <g>
            {nodes.map((d, i) => (
              <Rect
                key={d.index}
                index={d.index}
                x0={d.x0}
                x1={d.x1}
                y0={d.y0}
                y1={d.y1}
                name={d.name}
                value={d.value}
                length={nodes.length}
                swidth={width}
                sheight={height}
                colors={colors}
              />
            ))}
          </g>
        </svg>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Own;
