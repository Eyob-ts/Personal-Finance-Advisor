import { useQuery } from '@tanstack/react-query';
import { getSpendingByCategory } from '../dashboardApi';
import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const SpendingByCategory = () => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 }); // Default dimensions
  const [mounted, setMounted] = useState(false);

  // Initialize and handle resize
  useEffect(() => {
    setMounted(true);

    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(width, 400); // Keep it square, max 400px height
        setDimensions({ width, height });
      }
    };

    // Initial measurement
    updateDimensions();

    // Add event listener for window resize
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      setMounted(false);
    };
  }, []);

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ['spendingByCategory'],
    queryFn: getSpendingByCategory,
    staleTime: 1000 * 60 * 5 // 5 minutes
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

  // Draw chart
  useEffect(() => {
    if (!mounted || isLoading || error || chartData.length === 0) return;

    const { width, height } = dimensions;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.5;

    // Clear previous SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create SVG group centered in the container
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Color scale using your theme colors
    const color = d3.scaleOrdinal()
      .domain(chartData.map(d => d.name))
      .range([
        '#0d9488', // teal-600
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#ef4444', // red-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#14b8a6'  // teal-500
      ]);

    // Pie generator
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    // Arc generator
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    // Draw arcs
    const arcs = g.selectAll(".arc")
      .data(pie(chartData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "#001A16") // Dark background color
      .attr("stroke-width", 1)
      .style("opacity", 0)
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .style("opacity", 1)
      .attrTween("d", d => {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(interpolate(t));
      });

    // Center text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "#5EEAD4") // teal-300
      .text("Total")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .style("opacity", 1);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .style("fill", "#FFFFFF")
      .text(`$${totalSpending.toLocaleString()}`)
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .style("opacity", 1);

    // Tooltip interactions
    arcs.on("mouseover", function(event, d) {
      d3.select(this).select("path")
        .transition().duration(200)
        .attr("transform", "scale(1.05)");

      d3.select(tooltipRef.current)
        .style("opacity", 1)
        .html(`
          <div class="bg-[#01332B] p-3 rounded-lg shadow-lg border border-teal-500/30">
            <p class="font-semibold text-teal-200">${d.data.name}</p>
            <p class="text-teal-100">$${d.data.value.toLocaleString()}</p>
            <p class="text-sm text-teal-300">
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

  }, [chartData, isLoading, error, dimensions, totalSpending, mounted]);

  if (isLoading) {
    return (
      <div className="bg-[#01332B]/80 rounded-xl p-6 border border-teal-800/30 shadow-lg h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-4 rounded-lg">
        Error loading spending data: {error.message}
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-[#01332B]/80 rounded-xl p-6 border border-teal-800/30 shadow-lg text-center text-teal-200">
        <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
        <p>No spending data available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#01332B]/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-teal-800/30 shadow-lg">
      <motion.h3
        className="text-lg font-semibold mb-6 text-teal-100 font-rajdhani"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Spending by Category
      </motion.h3>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div
          ref={containerRef}
          className="relative w-full h-[300px] sm:h-[400px] max-w-[400px] mx-auto"
        >
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          />
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
                className="flex items-center justify-between p-3 bg-[#002822]/50 rounded-lg hover:bg-[#002822] transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: [
                        '#0d9488', '#3b82f6', '#10b981', '#f59e0b',
                        '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'
                      ][index % 8]
                    }}
                  />
                  <span className="font-medium text-teal-100">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-teal-50">
                    ${item.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-teal-300">
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