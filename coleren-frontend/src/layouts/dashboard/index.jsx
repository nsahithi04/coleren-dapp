import Sidebar from "@/components/dashboard/sidebar/index";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main
        className="ml-[220px] flex-1"
        style={{
          background:
            "linear-gradient(180.59deg, #FFFFFF -33.4%, #EBF7F4 108.11%)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
