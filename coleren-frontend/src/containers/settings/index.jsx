import Toggle from "@/components/common/toggle";
import DocsIcon from "@/components/common/icons/docsIcon";
import { useState, useEffect } from "react";

import { getProfile, updateProfile } from "../../services/userService";
import { auth } from "../../../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Settings() {
  const [checked, setChecked] = useState(false);
  const [features, setFeatures] = useState({
    multipleReleaseGroups: false,
    productSpecificFields: false,
    enableReportsForEditors: false,
  });

  const [feedback, setFeedback] = useState({
    surveysAdminOnly: false,
    newSurveysAllMembers: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const token = await firebaseUser.getIdToken();
        const data = await getProfile(token);

        console.log(data);

        setFeatures(data.profile?.settings?.features || {});
        setFeedback(data.profile?.settings?.feedback || {});
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = async (section, key, value) => {
    let updatedFeatures = features;
    let updatedFeedback = feedback;

    if (section === "features") {
      updatedFeatures = {
        ...features,
        [key]: value,
      };
      setFeatures(updatedFeatures);
    }

    if (section === "feedback") {
      updatedFeedback = {
        ...feedback,
        [key]: value,
      };
      setFeedback(updatedFeedback);
    }

    try {
      const token = await auth.currentUser.getIdToken();

      await updateProfile(token, {
        settings: {
          features: updatedFeatures,
          feedback: updatedFeedback,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  let iconBActive = "bg-[#E7FCEF] color-[#24BC61]";

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
        <h2 className="text-base font-semibold text-[#062732] mb-1">
          Features for bigger teams
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Enable these features to manage multiple products and teams
        </p>

        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
          <DocsIcon active={features.enableReportsForEditors} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#062732]">
              Multiple release groups
            </p>
            <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>
          </div>
          <Toggle
            checked={features.enableReportsForEditors}
            onChange={(val) =>
              handleToggle("features", "enableReportsForEditors", val)
            }
          />
        </div>

        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
          <DocsIcon active={features.multipleReleaseGroups} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#062732]">
              Product specific fields
            </p>
            <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>
          </div>
          <Toggle
            checked={features.multipleReleaseGroups}
            onChange={(val) =>
              handleToggle("features", "multipleReleaseGroups", val)
            }
          />
        </div>

        <div className="flex items-center gap-4 py-4">
          <DocsIcon active={features.productSpecificFields} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#062732]">
              Enable reports for all editors
            </p>
            <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet</p>
          </div>
          <Toggle
            checked={features.productSpecificFields}
            onChange={(val) =>
              handleToggle("features", "productSpecificFields", val)
            }
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-[#062732] mb-1">
          Feedbacks
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Give the right level of control
        </p>

        <div className="flex items-center gap-4 py-4 border-b border-gray-100">
          <DocsIcon active={feedback.surveysAdminOnly} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#062732]">
              Feedback surveys creation by admin only
            </p>
          </div>
          <Toggle
            checked={feedback.surveysAdminOnly}
            onChange={(val) =>
              handleToggle("feedback", "surveysAdminOnly", val)
            }
          />
        </div>

        <div className="flex items-center gap-4 py-4">
          <DocsIcon active={feedback.newSurveysAllMembers} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#062732]">
              Newly created surveys accessible to all members
            </p>
          </div>
          <Toggle
            checked={feedback.newSurveysAllMembers}
            onChange={(val) =>
              handleToggle("feedback", "newSurveysAllMembers", val)
            }
          />
        </div>
      </div>
    </div>
  );
}
