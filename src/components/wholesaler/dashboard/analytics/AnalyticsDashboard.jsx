"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAnalyticsController from "./useAnalyticsController";
import KPIGrid from "./KPIGrid";
import PerformanceLine from "./PerformanceLine";
import UsersVisitsBar from "./UsersVisitsBar";
import AudienceInsightBar from "./AudienceInsightBar";
import SalesLocationCard from "./SalesLocationCard";
import InvoiceUpload from "./InvoiceUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsDashboard({ initialRange }) {
  const { range, setRange, ranges, data } =
    useAnalyticsController(initialRange);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Analytics</h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 sm:mt-2">
            Monitor progress regularly to increase sales
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-auto min-w-[140px] sm:w-[180px] md:w-[200px] text-sm border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ranges.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button className="rounded-md bg-[#F36E16] hover:bg-[#e06212] text-white px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors">
            Export
          </button>
        </div>
      </div>

      <KPIGrid kpi={data.kpi} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <PerformanceLine labels={data.labels} values={data.performance} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Users Visits</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <UsersVisitsBar
              labels={data.usersVisits.labels}
              values={data.usersVisits.values}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Audience Insight</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <AudienceInsightBar
              labels={data.audienceInsight.labels}
              men={data.audienceInsight.men}
              women={data.audienceInsight.women}
              other={data.audienceInsight.other}
            />
          </CardContent>
        </Card>
        <SalesLocationCard data={data.salesLocation} />
      </div>

      {/* Invoice Upload Section */}
      <InvoiceUpload />
    </div>
  );
}
