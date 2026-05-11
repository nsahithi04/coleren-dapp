import DashboardLayout from "../../layout/dashboardLayout";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setUser } from "@/store/userSlice";
import { auth } from "../../../firebase";

import { getProfile, updateTask } from "../../services/userService";
import { onAuthStateChanged } from "firebase/auth";

export default function GettingStarted() {
  const dispatch = useDispatch();

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

  let user = useSelector((state) => state.user);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      try {
        const token = await firebaseUser.getIdToken();
        const data = await getProfile(token);

        setProfile(data.profile);
      } catch (err) {
        console.error(err);
      }
    });

    return () => unsubscribe();
  }, []);

  let completed = 0;

  if (profile?.onboarding) {
    completed = tasks.filter((task) => profile.onboarding[task.key]).length;
  }

  const toggle = async (key, isDone) => {
    try {
      const token = await auth.currentUser.getIdToken();
      console.log(key, !isDone);
      const updated = await updateTask(key, !isDone, token);
      setProfile(updated.profile);
    } catch (err) {}
  };

  return (
    <DashboardLayout>
      <div className="mx-auto p-10 min-h-screen">
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
                {/* TIMELINE */}
                <div className="flex flex-col items-center pt-4">
                  {tasks.map((task, i) =>
                    (() => {
                      let isDone = profile?.onboarding?.[task.key];

                      let dotClass = "border-gray-300 bg-white";
                      let lineClass = "bg-gray-200";

                      if (isDone) {
                        dotClass = "bg-[#24BC61] border-[#24BC61]";
                        lineClass = "bg-[#24BC61]";
                      }

                      return (
                        <div
                          key={i}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dotClass}`}
                          ></div>

                          {i < tasks.length - 1 && (
                            <div
                              className={`w-0.5 flex-1 min-h-[40px] ${lineClass}`}
                            />
                          )}
                        </div>
                      );
                    })(),
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  {tasks.map((task, i) =>
                    (() => {
                      let isDone = profile?.onboarding?.[task.key];

                      let taskClass = "border-[#CFCFCF] hover:bg-gray-50";
                      let checkClass = "border-gray-300";
                      let textClass = "text-gray-700";

                      if (isDone) {
                        taskClass = "border-gray-100 bg-gray-50 opacity-60";
                        checkClass = "bg-[#24BC61] border-[#24BC61]";
                        textClass = "line-through text-gray-400";
                      }

                      return (
                        <div
                          key={i}
                          onClick={() => toggle(task.key, isDone)}
                          className={`flex items-center gap-3 p-3 border rounded-md cursor-pointer ${taskClass}`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checkClass}`}
                          ></div>

                          <span className={`text-sm ${textClass}`}>
                            {task.label}
                          </span>
                        </div>
                      );
                    })(),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-white shadow-[0px_8px_30px_0px_#0000000D] rounded-xl p-6">
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
