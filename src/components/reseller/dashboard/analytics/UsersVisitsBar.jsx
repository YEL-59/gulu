import ChartSetup from "@/components/reseller/dashboard/charts/ChartSetup";
import { Bar } from "react-chartjs-2";
import visits from "@/lib/data/analyticsVisits.json";
import { useMemo, useState } from "react";

export default function UsersVisitsBar() {
  ChartSetup();
  const [period, setPeriod] = useState("W");

  const { labels, values, change } = visits.data[period];

  const suggestedMax = useMemo(() => {
    const max = Math.max(...values);
    const step = period === "Y" ? 20000 : period === "M" ? 10000 : 2500;
    return Math.ceil(max / step) * step;
  }, [values, period]);

  const data = {
    labels,
    datasets: [
      {
        label: "Visits",
        data: values,
        backgroundColor: "#2563eb",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        beginAtZero: true,
        suggestedMax,
      },
    },
  };

  const PeriodButton = ({ value }) => (
    <button
      onClick={() => setPeriod(value)}
      className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-sm ${
        period === value ? "text-blue-600 font-semibold" : "text-gray-400"
      }`}
    >
      {value}
    </button>
  );

  return (
    <div>
      {/* Header to match design: title, change, and period toggles */}
      <div className="mb-2 sm:mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="text-xs sm:text-sm font-medium">Users Visits</div>
          <div className="text-xs text-emerald-600">
            +{change}% from last period
          </div>
        </div>
        <div className="flex items-center gap-1">
          <PeriodButton value="D" />
          <PeriodButton value="W" />
          <PeriodButton value="M" />
          <PeriodButton value="Y" />
        </div>
      </div>

      <div className="h-56 sm:h-64 md:h-72">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
