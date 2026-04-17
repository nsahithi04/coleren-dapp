import DashboardLayout from "@/layouts/dashboard/index";

export default function Connectors() {
  const CONNECTORS = [
    {
      name: "Salesforce",
      desc: "Last synced: 12 min ago",
      status: "connected",
      icon: "salesforce",
    },
    {
      name: "Microsoft Teams",
      desc: "Last synced: 1 min ago",
      status: "connected",
      icon: "teams",
    },
    {
      name: "Gmail",
      desc: "Last synced: 12 min ago",
      status: "connected",
      icon: "gmail",
    },
    {
      name: "Microsoft Outlook",
      desc: "Last synced: 2 min ago",
      status: "setup",
      icon: "outlook",
    },
  ];

  const cards = [];

  for (let i = 0; i < CONNECTORS.length; i++) {
    const item = CONNECTORS[i];

    let statusUI;

    if (item.status === "connected") {
      statusUI = (
        <div className="inline-flex items-center gap-2 bg-[#25C766] text-white px-3 py-1 rounded-full text-sm w-fit">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          Connected
        </div>
      );
    } else {
      statusUI = (
        <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm w-fit">
          <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
          Setup Connector
        </div>
      );
    }

    cards.push(
      <div
        key={i}
        className="flex items-center justify-between px-6 py-6 border border-[#A1A1A180] rounded-2xl bg-white"
      >
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#F4F4F4] flex items-center justify-center">
            <svg
              width="44"
              height="31"
              viewBox="0 0 44 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <rect width="44" height="31" fill="url(#pattern0_93_1514)" />
              <defs>
                <pattern
                  id="pattern0_93_1514"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    xlink:href="#image0_93_1514"
                    transform="matrix(0.00374758 0 0 0.00531915 -0.00404981 0)"
                  />
                </pattern>
                <image
                  id="image0_93_1514"
                  width="269"
                  height="188"
                  preserveAspectRatio="none"
                  xlink:href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold text-[#062732]">{item.name}</p>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>

            <div className="mt-4">{statusUI}</div>
          </div>
        </div>

        {/* RIGHT ARROW */}
        <div className="w-10 h-10 rounded-full bg-[#E7FCEF] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M8.5 15L13.5 10L8.5 5"
              stroke="#25C766"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>,
    );
  }

  return (
    <DashboardLayout>
      <div className="p-10 flex flex-col gap-8">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-[#062732]">Connectors</h1>

        {/* GRID */}
        <div className="bg-[#F7F9F8] p-6 rounded-2xl">
          <div className="grid grid-cols-2 gap-6">{cards}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
