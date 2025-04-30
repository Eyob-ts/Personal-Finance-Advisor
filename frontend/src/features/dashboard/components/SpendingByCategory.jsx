import { useQuery } from '@tanstack/react-query';
import { getSpendingByCategory } from '../dashboardApi';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const SpendingByCategory = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['spendingByCategory'],
    queryFn: getSpendingByCategory
  });

  const transformData = useCallback((rawData) => {
    if (!rawData) return [];
    return Object.entries(rawData).map(([name, amount]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(amount)
    }));
  }, []);

  const chartData = transformData(apiData);
  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (isLoading || error || chartData.length === 0 || dimensions.width === 0) return;

    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = dimensions.width;
    const containerHeight = Math.min(dimensions.width, 400);
    const radius = Math.min(containerWidth, containerHeight) / 2;
    const innerRadius = radius * 0.5;

    const svg = d3.select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${containerWidth} ${containerHeight}`)
      .append("g")
      .attr("transform", `translate(${containerWidth / 2},${containerHeight / 2})`);

    // Add SVG background
    svg.append("rect")
      .attr("x", -containerWidth / 2)
      .attr("y", -containerHeight / 2)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .attr("fill", "#F3F4F6"); // Tailwind's gray-100

    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.name))
      .range(['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316']);

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = svg.selectAll(".arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.8)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style("opacity", 1)
      .attrTween("d", d => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(interpolate(t));
      });

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-size", Math.min(16, radius * 0.15) + "px")
      .style("font-weight", "bold")
      .style("fill", "#4B5563")
      .text("Total")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .style("opacity", 1);

    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .style("font-size", Math.min(20, radius * 0.2) + "px")
      .style("font-weight", "bold")
      .style("fill", "#1F2937")
      .text(`$${totalSpending.toLocaleString()}`)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .style("opacity", 1);

    arcs.on("mouseover", function(event, d) {
      d3.select(this).select("path")
        .transition().duration(200)
        .attr("transform", "scale(1.05)");

      d3.select(tooltipRef.current)
        .style("opacity", 1)
        .html(`
          <div class="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
            <p class="font-semibold text-gray-800">${d.data.name}</p>
            <p class="text-gray-600">$${d.data.value.toLocaleString()}</p>
            <p class="text-sm text-gray-500">
              ${((d.data.value / totalSpending) * 100).toFixed(1)}% of total
            </p>
          </div>
        `);
    })
    .on("mousemove", (event) => {
      d3.select(tooltipRef.current)
        .style("left", `${event.pageX + 15}px`)
        .style("top", `${event.pageY - 15}px`);
    })
    .on("mouseout", function() {
      d3.select(this).select("path")
        .transition().duration(200)
        .attr("transform", "scale(1)");

      d3.select(tooltipRef.current).style("opacity", 0);
    });

  }, [chartData, isLoading, error, dimensions, totalSpending]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 h-[400px] animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-[300px] bg-gray-200 rounded-full"></div>
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
      <div className="bg-blue-500 rounded-xl shadow-sm p-6 text-center text-white">
        <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
        <p className="text-gray-100">No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <motion.h3
        className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Spending by Category
      </motion.h3>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div
          ref={containerRef}
          className="relative w-full aspect-square max-w-[400px] mx-auto"
        >
          <svg ref={svgRef} className="w-full h-full" preserveAspectRatio="xMidYMid meet" />
          <div
            ref={tooltipRef}
            className="absolute pointer-events-none opacity-0 transition-opacity duration-200 z-50"
          />
        </div>

        <div className="w-full lg:w-1/2 space-y-3">
          {chartData
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <motion.div
                key={item.name}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'][index % 8] }}
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((item.value / totalSpending) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SpendingByCategory;
