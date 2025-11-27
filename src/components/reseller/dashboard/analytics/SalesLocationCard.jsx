"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartSetup from "@/components/reseller/dashboard/charts/ChartSetup";
import { Chart } from "react-chartjs-2";
import { feature } from "topojson-client";
import world from "world-atlas/countries-50m.json";

export default function SalesLocationCard({ data }) {
  ChartSetup();
  const items = data?.countries ?? [];
  const max = Math.max(...items.map((c) => c.value), 1);

  // Build a quick lookup by country name
  const valuesByName = Object.fromEntries(items.map((c) => [c.name, c.value]));

  const countries = feature(world, world.objects.countries).features;

  const geoData = {
    labels: countries.map((d) => d.properties.name),
    datasets: [
      {
        label: "Sales by Country",
        data: countries.map((d) => ({
          feature: d,
          value: valuesByName[d.properties.name] || 0,
        })),
        borderColor: "#ffffff",
        borderWidth: 0.5,
        backgroundColor: (ctx) => {
          const v = ctx.raw?.value || 0;
          const t = Math.min(1, Math.max(0, v / max));
          const start = [191, 219, 254]; // #bfdbfe
          const end = [29, 78, 216]; // #1d4ed8
          const r = Math.round(start[0] + (end[0] - start[0]) * t);
          const g = Math.round(start[1] + (end[1] - start[1]) * t);
          const b = Math.round(start[2] + (end[2] - start[2]) * t);
          return `rgb(${r},${g},${b})`;
        },
      },
    ],
  };

  const geoOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.raw.feature.properties.name}: ${ctx.raw.value}%`,
        },
      },
    },
    scales: {
      projection: { type: "projection", axis: "x", projection: "equalEarth" },
    },
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Sales Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        <div className="rounded-md bg-sky-50 p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-sky-700">
            {data?.highlight?.country} • {data?.highlight?.percent}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Top performing region this period.
          </div>
        </div>

        {/* World map choropleth */}
        <div className="h-56 sm:h-64 md:h-72">
          <Chart type="choropleth" data={geoData} options={geoOptions} />
        </div>

        <div className="space-y-2 sm:space-y-3">
          {items.map((c) => (
            <div key={c.name}>
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="truncate">{c.name}</span>
                <span className="text-muted-foreground flex-shrink-0">{c.value}%</span>
              </div>
              <div className="h-1.5 sm:h-2 bg-muted rounded-md overflow-hidden mt-1">
                <div
                  className="h-full bg-sky-500"
                  style={{ width: `${(c.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
