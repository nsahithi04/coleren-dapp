import { useSelector } from "react-redux";
import DashboardLayout from "@/layouts/dashboard/index";
import { useState, useEffect } from "react";
import { getMyProfile, updateOnboarding } from "@/services/userService";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { getUser } from "@/services/userService";

const tasks = [
  {
    label: "Add a connector with any of the platforms available",
    key: "connectorAdded",
  },
  {
    label: "Invite or add a team member",
    key: "teamInvited",
  },
  {
    label: "Setup a sequence for your feedback process",
    key: "sequenceCreated",
  },
  {
    label: "Send a survey to your team members for feedback",
    key: "surveySent",
  },
  {
    label: "Initiate a chat with AI assistant to improve searches",
    key: "aiChatUsed",
  },
  {
    label: "Receive feedback from your team",
    key: "feedbackReceived",
  },
];

export default function GettingStarted() {
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);

  console.log("Redux user:", user);
  console.log("Profile:", profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getMyProfile();
        const userData = await getUser();

        setProfile(profileData);

        dispatch(
          setUser({
            uid: user.uid,
            name: userData.name,
            email: userData.email,
            role: profileData.role,
            teamSize: profileData.teamSize,
            workType: profileData.workType,
            subscribed: profileData.subscribed,
            fromGoogle: user.fromGoogle,
          }),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const toggle = async (key, currentValue) => {
    try {
      const updated = await updateOnboarding({ key, value: !currentValue });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const completed = Object.values(profile?.onboarding || {}).filter(
    Boolean,
  ).length;

  return (
    <DashboardLayout>
      <div className="mx-auto p-10">
        <div className="text-[#062732] font-bold pb-5">Getting Started</div>

        <div className="grid gap-5 grid-cols-[2fr_1fr]">
          <div className="bg-white shadow-[0px_8px_30px_0px_#0000000D] rounded-xl overflow-hidden">
            <p className="font-semibold text-[#062732] text-2xl p-6">
              Hi {(user?.name || "there").trim()}, Welcome to Coleren
            </p>
            <div className="border-t border-black/10" />

            <div className="p-6">
              <div className="grid grid-cols-[auto_1fr] gap-10 items-center justify-items-end">
                <p className="text-lg font-semibold mb-1">
                  Get started by completing the following tasks
                </p>
                <p className="text-sm mb-2 p-3 rounded-sm bg-[#E7FCEF] text-[#24BC61] w-fit">
                  {completed} / {tasks.length} completed
                </p>
              </div>

              <div className="grid grid-cols-[40px_1fr] gap-10 mt-10">
                {/* Timeline */}
                <div className="flex flex-col items-center pt-4">
                  {tasks.map((task, i) => {
                    const isDone = profile?.onboarding?.[task.key];
                    const dotClass = isDone
                      ? "bg-[#24BC61] border-[#24BC61]"
                      : "border-gray-300 bg-white";
                    const lineClass = isDone ? "bg-[#24BC61]" : "bg-gray-200";

                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all duration-300 flex items-center justify-center ${dotClass}`}
                        >
                          {isDone && (
                            <svg
                              width="8"
                              height="7"
                              viewBox="0 0 8 7"
                              fill="none"
                            >
                              <path
                                d="M1 3L3 5.5L7 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        {i < tasks.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 min-h-[28px] transition-all duration-300 ${lineClass}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Task list */}
                <div className="flex flex-col gap-2.5">
                  {tasks.map((task, i) => {
                    const isDone = profile?.onboarding?.[task.key];
                    const taskClass = isDone
                      ? "border-gray-100 bg-gray-50 opacity-60"
                      : "border-[#CFCFCF] hover:border-gray-400 hover:bg-gray-50";
                    const checkClass = isDone
                      ? "bg-[#24BC61] border-[#24BC61]"
                      : "border-gray-300";
                    const textClass = isDone
                      ? "line-through text-gray-400"
                      : "text-gray-700";

                    return (
                      <div
                        key={i}
                        onClick={() => toggle(task.key, isDone)}
                        className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer select-none transition-all duration-200 ${taskClass}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300 ${checkClass}`}
                        >
                          {isDone && (
                            <svg
                              width="9"
                              height="7"
                              viewBox="0 0 9 7"
                              fill="none"
                            >
                              <path
                                d="M1 3L3.5 5.5L8 1"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-all duration-300 ${textClass}`}
                        >
                          {task.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-[0px_8px_30px_0px_#0000000D] rounded-xl overflow-hidden h-full p-6">
            <p className="font-semibold text-[#062732] text-2xl">
              Connect power tools to improve product efficiency
            </p>
            <p className="opacity-20 pt-5">
              Get started by completing the following tasks
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
