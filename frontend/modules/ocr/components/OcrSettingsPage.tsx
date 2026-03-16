import React, {useEffect, useRef} from "react";
import {TabItem, Tabs, TabsRef} from "flowbite-react";
import {useLocation, useNavigate} from "react-router-dom";
import {OcrHistorySection} from "@ocr/components/OcrHistorySection.tsx";
import {OcrProvidersSettingsSection} from "@ocr/components/OcrProvidersSettingsSection.tsx";
import {OcrWorkspaceSection} from "@ocr/components/OcrWorkspaceSection.tsx";

export function OcrSettingsPage() {
  const tabsRef = useRef<TabsRef>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = (() => {
    if (location.pathname.includes("/history")) {
      return 1;
    }
    if (location.pathname.includes("/settings")) {
      return 2;
    }
    return 0;
  })();

  useEffect(() => {
    tabsRef.current?.setActiveTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        navigate("/admin/ocrsettings");
        break;
      case 1:
        navigate("/admin/ocrsettings/history");
        break;
      case 2:
        navigate("/admin/ocrsettings/settings");
        break;
    }
  };

  return (
    <div className="flex h-full flex-col gap-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">OCR</h2>
        <p className="text-sm text-gray-500">Run OCR tasks, manage saved instructions, inspect history, and update provider settings.</p>
      </div>

      <Tabs variant="underline" onActiveTabChange={handleTabChange} ref={tabsRef}>
        <TabItem title="OCR">
          <OcrWorkspaceSection/>
        </TabItem>
        <TabItem title="History">
          <OcrHistorySection/>
        </TabItem>
        <TabItem title="Settings">
          <OcrProvidersSettingsSection/>
        </TabItem>
      </Tabs>
    </div>
  );
}
