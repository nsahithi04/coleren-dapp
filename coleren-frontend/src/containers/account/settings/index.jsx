import { useState, useEffect } from "react";
import Toggle from "@/components/account/toggle";
import SettingIcon from "@/components/account/icons/setting";
import { updateSettings } from "@/services/settingsService";
import { getMyProfile } from "@/services/userService";

export default function Settings() {
  const [features, setFeatures] = useState({
    multipleReleaseGroups: false,
    productSpecificFields: false,
    enableReportsForEditors: false,
  });

  const [feedbacks, setFeedbacks] = useState({
    surveysAdminOnly: false,
    newSurveysAllMembers: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getMyProfile();
        if (data?.settings?.features)
          setFeatures((prev) => ({ ...prev, ...data.settings.features }));
        if (data?.settings?.feedbacks)
          setFeedbacks((prev) => ({ ...prev, ...data.settings.feedbacks }));
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async (setter, state, key, group) => {
    const updated = { ...state, [key]: !state[key] };
    setter(updated);
    try {
      await updateSettings({ [group]: updated });
    } catch (err) {
      console.error("Failed to save settings", err);
      setter(state); // rollback
    }
  };

  const getIconBg = (enabled) => (enabled ? "bg-[#E7FCEF]" : "bg-[#CFCFCF]");
  const getIconColor = (enabled) => (enabled ? "#3CC8A1" : "#ffffff");

  const featuresRows = [
    {
      key: "multipleReleaseGroups",
      label: "Multiple release groups",
      sub: "Lorem ipsum dolor sit amet",
    },
    {
      key: "productSpecificFields",
      label: "Product specific fields",
      sub: "Lorem ipsum dolor sit amet",
    },
    {
      key: "enableReportsForEditors",
      label: "Enable reports for all editors",
      sub: "Lorem ipsum dolor sit amet",
    },
  ];

  const feedbackRows = [
    {
      key: "surveysAdminOnly",
      label: "Feedback surveys creation by admin only",
    },
    {
      key: "newSurveysAllMembers",
      label: "Newly created surveys accessible to all members",
    },
  ];

  const SettingRow = ({ enabled, label, sub, onToggle, isLast }) => (
    <div
      className={`flex items-center gap-4 py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
    >
      <div
        className={`w-11 h-11 flex items-center justify-center rounded-xl ${getIconBg(enabled)}`}
      >
        <SettingIcon color={getIconColor(enabled)} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#062732]">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      <Toggle checked={enabled} onChange={onToggle} />
    </div>
  );

  return (
    <div>
      {/* FEATURES */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <h2 className="text-base font-semibold text-[#062732] mb-1">
          Features for bigger teams
        </h2>
        <p className="text-sm text-gray-400 mb-2">
          Enable these features to manage multiple products and teams
        </p>
        {featuresRows.map(({ key, label, sub }, i) => (
          <SettingRow
            key={key}
            enabled={features[key]}
            label={label}
            sub={sub}
            onToggle={() =>
              handleToggle(setFeatures, features, key, "features")
            }
            isLast={i === featuresRows.length - 1}
          />
        ))}
      </div>

      {/* FEEDBACKS */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-[#062732] mb-1">
          Feedbacks
        </h2>
        <p className="text-sm text-gray-400 mb-2">
          Give the right level of control
        </p>
        {feedbackRows.map(({ key, label }, i) => (
          <SettingRow
            key={key}
            enabled={feedbacks[key]}
            label={label}
            onToggle={() =>
              handleToggle(setFeedbacks, feedbacks, key, "feedbacks")
            }
            isLast={i === feedbackRows.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
