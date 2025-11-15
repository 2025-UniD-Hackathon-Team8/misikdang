import { useMemo, useState, useEffect } from "react";
import AcceptModal from "../components/AcceptModal";
import RequestCardLarge from "../components/RequestCardLarge";
import RequestCardSmall from "../components/RequestCardSmall";
import ToggleTabs from "../components/ToggleTabs";
import { getGourmetRequests } from "../utils/localStorage";

const TABS = [
  { id: "sent", label: "내가 한 요청" },
  { id: "received", label: "받은 요청" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type RequestItem = {
  id: string;
  type: "sent" | "received";
  title: string;
  subtitle: string;
  thumbnail: string;
};

export default function UserRequestHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabId>("sent");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Set<string>>(
    () => new Set()
  );
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // localStorage에서 받은 요청 로드
  useEffect(() => {
    const storedRequests = getGourmetRequests();
    setRequests(storedRequests);
  }, []);

  const visibleRequests = useMemo(
    () =>
      requests.filter((request) =>
        activeTab === "received"
          ? request.type === "received"
          : request.type === "sent"
      ),
    [activeTab, requests]
  );

  const handleRemoveRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((request) => request.id !== requestId));
  };

  const handleAcceptRequest = (requestId: string) => {
    setAcceptedRequests((prev) => {
      const next = new Set(prev);
      next.add(requestId);
      return next;
    });
    setShowAcceptModal(true);
  };

  return (
    <div className="flex min-h-dvh justify-center bg-[var(--color-background)] px-4 py-6 text-left">
      <main className="relative flex w-full max-w-[393px] flex-col items-center gap-[15px] px-4 pb-10 pt-[111px]">
        <div className="absolute left-[10px] top-[55px] h-[26px] w-[15px]"></div>
        <ToggleTabs
          tabs={TABS}
          activeTabId={activeTab}
          onTabSelect={(id) => setActiveTab(id as TabId)}
        />

        <div className="flex flex-col items-center gap-[15px]">
          {visibleRequests.map((request) => {
            const isReceived = request.type === "received";
            const isAccepted = acceptedRequests.has(request.id);
            return (
              <div key={request.id} className="w-full">
                {isReceived ? (
                  <RequestCardLarge
                    title={request.title}
                    subtitle={request.subtitle}
                    thumbnailColor={request.thumbnail}
                    onClose={() => handleRemoveRequest(request.id)}
                    leftAction={
                      isAccepted
                        ? undefined
                        : {
                            label: "거절하기",
                            variant: "secondary",
                            onClick: () => handleRemoveRequest(request.id),
                          }
                    }
                    rightAction={
                      isAccepted
                        ? {
                            label: "수락되었습니다",
                            disabled: true,
                            fullWidth: true,
                          }
                        : {
                            label: "수락하기",
                            onClick: () => handleAcceptRequest(request.id),
                          }
                    }
                  />
                ) : (
                  <RequestCardSmall
                    title={request.title}
                    subtitle={request.subtitle}
                    thumbnailColor={request.thumbnail}
                    onClose={() => handleRemoveRequest(request.id)}
                    onClick={() => console.log("clicked")}
                  />
                )}
              </div>
            );
          })}
          {visibleRequests.length === 0 && (
            <p className="text-sm text-[var(--color-gray-2)]">
              표시할 요청이 아직 없어요.
            </p>
          )}
        </div>
      </main>
      {showAcceptModal && (
        <AcceptModal
          message="수락되었습니다!"
          onClose={() => setShowAcceptModal(false)}
        />
      )}
    </div>
  );
}
