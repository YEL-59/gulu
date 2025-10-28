import DashboardShell from "@/components/reseller/dashboard/DashboardShell";

export default function Layout({ children }) {
  return <DashboardShell base="reseller">{children}</DashboardShell>;
}