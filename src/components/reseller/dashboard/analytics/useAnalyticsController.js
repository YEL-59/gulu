// MVC: Controller. Centralizes range selection and data hydration for analytics views.
import { useMemo, useState } from "react";
import { getAnalyticsData } from "../../../../lib/data/analyticsData";

export default function useAnalyticsController(
  initialRange = "Dec 24 – Dec 31"
) {
  const [range, setRange] = useState(initialRange);

  const data = useMemo(() => getAnalyticsData(range), [range]);

  const ranges = [
    "Dec 24 – Dec 31",
    "Dec 17 – Dec 23",
    "Dec 10 – Dec 16",
    "Dec 03 – Dec 09",
  ];

  return {
    range,
    setRange,
    ranges,
    data,
  };
}
