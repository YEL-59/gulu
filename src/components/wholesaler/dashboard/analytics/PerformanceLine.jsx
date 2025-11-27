import ChartSetup from "@/components/wholesaler/dashboard/charts/ChartSetup";
import { Line } from "react-chartjs-2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import perfData from "@/lib/data/analyticsPerformance.json";
import { CircleHelp } from "lucide-react";
import { useMemo, useState } from "react";

export default function PerformanceLine() {
  ChartSetup();
  const metrics = Object.keys(perfData.series);
  const [metric, setMetric] = useState("Impressions");

  const labels = perfData.labels;
  const values = perfData.series[metric];

  const suggestedMax = useMemo(() => {
    const max = Math.max(...values);
    const rounded = Math.ceil(max / 10000) * 10000;
    return Math.max(rounded, 50000);
  }, [values]);

  const formatK = (n) => {
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return `${n}`;
  };

  const data = {
    labels,
    datasets: [
      {
        label: metric,
        data: values,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        tension: 0.35,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${new Intl.NumberFormat("en-US").format(
              ctx.parsed.y
            )}`,
        },
      },
    },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.05)" } },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        beginAtZero: true,
        ticks: {
          stepSize: 10000,
          callback: (value) => formatK(value),
        },
        suggestedMax,
      },
    },
  };

  return (
    <div className="relative h-56 sm:h-64 md:h-72">
      {/* Top bar: title with info and dropdown to match design */}
      <div className="absolute -top-8 sm:-top-9 right-0 flex items-center gap-2">
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="h-7 sm:h-8 w-32 sm:w-40 bg-white shadow-sm text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {metrics.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Line data={data} options={options} />
    </div>
  );
}

