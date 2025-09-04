import { useAppSelector } from "../app/hooks";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { selectChartData } from "../features/portfolio/portfolioSelectors";

const PortfolioChart = () => {
  const chartData = useAppSelector(selectChartData);

  return (
    <div>
      <p className="text-muted text-sm">Portfolio Total</p>
      <div className="flex flex-col sm:flex-row">
        <div className="flex justify-center">
            <PieChart width={180} height={180}>
          <Pie
            data={chartData}
            innerRadius={40}
            outerRadius={80}
            dataKey="percentage"
          >
            {chartData.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        </div>
        <div className="flex-1 mt-4 sm:mt-0 sm:ml-4 chart-legend h-50 overflow-y-auto">
          {chartData.map((entry) => (
            <div key={entry.id} className="flex justify-between space-y-1">
              <p className="text-sm" style={{ color: entry.color }}>
                {entry.name}  ({entry.symbol.toUpperCase()})
              </p>
              <p className="text-sm text-muted">
                {entry.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioChart;
