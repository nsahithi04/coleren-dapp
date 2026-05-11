import { useState } from "react";
import { useEffect } from "react";

export default function Details({ ActiveCard, data }) {
  if (!ActiveCard || !data) return null;

  return (
    <div className="bg-white grid grid-rows-[auto_1fr_auto] h-full p-2 shadow-md rounded-lg">
      <div className="p-5 bg-[#F8F8F8]">
        <p className="font-semibold text-[#062732] text-2xl capitalize">
          {ActiveCard}
        </p>
      </div>

      <div className="p-4 overflow-y-auto">
        {ActiveCard === "productMarket" &&
          Array.isArray(data) &&
          data.map((item) => (
            <div key={item._id} className="p-3 border-b">
              <p className="font-semibold">{item.name}</p>

              <p className="text-sm text-gray-500">
                Market Score: {item.productMarketFitScore}
              </p>

              {item.representativeName && (
                <p className="text-sm text-gray-500">
                  {item.representativeName}
                </p>
              )}
            </div>
          ))}

        {ActiveCard === "conversion" &&
          Array.isArray(data) &&
          data.map((item, index) => (
            <div key={index} className="p-3 border-b flex justify-between">
              <p className="font-semibold">{item.month}</p>

              <div className="text-right">
                <p className="text-sm text-gray-500">Leads: {item.leads}</p>

                <p className="text-sm text-[#24BC61]">
                  Converted: {item.converted}
                </p>
              </div>
            </div>
          ))}

        {ActiveCard === "competitor" &&
          Array.isArray(data) &&
          data.map((item) => (
            <div key={item._id} className="p-3 border-b">
              <p className="font-semibold">{item.name}</p>

              <p className="text-sm text-gray-500">
                Competitor Score: {item.competitorScore}
              </p>

              {item.representativeName && (
                <p className="text-sm text-gray-500">
                  {item.representativeName}
                </p>
              )}
            </div>
          ))}

        {(ActiveCard === "Leads" ||
          ActiveCard === "LeadsConversion" ||
          ActiveCard === "Leadsconverted") &&
          Array.isArray(data) &&
          data.map((item) => (
            <div key={item._id} className="p-3 border-b">
              <p className="font-semibold">{item.client}</p>

              <p className="text-sm text-gray-500">
                Representative: {item.representativeName}
              </p>

              <p className="text-sm text-gray-500">Outcome: {item.outcome}</p>

              <p className="text-sm text-gray-500">Status: {item.status}</p>
            </div>
          ))}

        {(ActiveCard === "MonthlyLeads" ||
          ActiveCard === "MonthlyConversions") &&
          Array.isArray(data) &&
          data.map((item) => (
            <div key={item._id} className="p-3 border-b">
              <p className="font-semibold">{item.client}</p>

              <p className="text-sm text-gray-500">{item.representativeName}</p>

              <p className="text-sm text-gray-500">{item.outcome}</p>
            </div>
          ))}

        {!Array.isArray(data) && (
          <p className="text-lg text-[#24BC61]">{data}</p>
        )}
      </div>
    </div>
  );
}
