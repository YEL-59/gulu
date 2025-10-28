"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { GeoFeature, ChoroplethController, ProjectionScale, ColorScale } from "chartjs-chart-geo";

ChartJS.register(
  LineElement,
  PointElement,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  // Geo charts
  GeoFeature,
  ChoroplethController,
  ProjectionScale,
  ColorScale
);

ChartJS.defaults.responsive = true;
ChartJS.defaults.maintainAspectRatio = false;
ChartJS.defaults.plugins.legend.position = "bottom";
ChartJS.defaults.plugins.legend.labels.boxWidth = 12;
ChartJS.defaults.elements.line.tension = 0.35;

export default function ChartSetup() {
  // This component just ensures Chart.js is registered in client.
  return null;
}