import { useQuery } from '@tanstack/react-query';
import { getSpendingByCategory } from '../dashboardApi';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const SpendingByCategory = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['spendingByCategory'],
    queryFn: getSpendingByCategory
  });

  // Transform API data
  const transformData = (rawData) => {
    if (!rawData) return [];
    return Object.entries(rawData).map(([name, amount]) => ({
      name: `Category ${name}`,
      value: parseFloat(amount),
      percentage: 100 // Will be recalculated below
    }));
  };

  const chartData = transformData(apiData);
  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  // Calculate percentages
  chartData.forEach(item => {
    item.percentage = (item.value / totalSpending) * 100;
  });

  useEffect(() => {
    if (isLoading || error || chartData.length === 0) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll("*").remove();

    // Dimensions
    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    // Color scale
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.name))
      .range(d3.schemeTableau10);

    // Pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    // Create arcs
    const arcs = svg.selectAll(".arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Draw arcs with animation
    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style("opacity", 1)
      .attrTween("d", d => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(interpolate(t));
      });

    // Add percentage labels
    arcs.append("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .attr("dy", "0.35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#1f2937")
      .text(d => `${Math.round(d.data.percentage)}%`)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .style("opacity", 1);

    // Tooltip events
    arcs.on("mouseover", (event, d) => {
        d3.select(event.currentTarget).select("path")
          .transition()
          .duration(200)
          .attr("opacity", 0.8);

        tooltipRef.current.style.opacity = 1;
        tooltipRef.current.innerHTML = `
          <div class="p-3 bg-white rounded-lg shadow-lg border border-gray-200">
            <p class="font-semibold">${d.data.name}</p>
            <p class="text-gray-600">$${d.data.value.toLocaleString()}</p>
            <p class="text-sm text-gray-500">${d.data.percentage.toFixed(1)}% of total</p>
          </div>
        `;
      })
      .on("mousemove", (event) => {
        tooltipRef.current.style.left = `${event.pageX + 10}px`;
        tooltipRef.current.style.top = `${event.pageY - 10}px`;
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).select("path")
          .transition()
          .duration(200)
          .attr("opacity", 1);
        tooltipRef.current.style.opacity = 0;
      });

  }, [apiData, isLoading, error]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-[300px] bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading spending data: {error.message}
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
        <p className="text-gray-500">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <motion.h3
        className="text-lg font-semibold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Spending by Category
      </motion.h3>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="h-[300px] w-full lg:w-1/2 flex justify-center">
          <svg ref={svgRef} className="max-h-full" />
          <div
            ref={tooltipRef}
            className="fixed pointer-events-none opacity-0 transition-opacity duration-200 z-50"
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {chartData
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d3.schemeTableau10[index % 10] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="font-medium">
                  ${item.value.toLocaleString()}
                </span>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategory;