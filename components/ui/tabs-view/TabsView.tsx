import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TabsViewProps {
  tabs: { key: string; label: ReactNode; content: ReactNode }[];
}

const TabsView = ({ tabs }: TabsViewProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || "");

  return (
    <View className="w-full">
      {/* Tab Bar */}
      <View className="flex-row bg-zinc-900 rounded-2xl p-1 mb-4 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              className="flex-1 items-center py-2 rounded-2xl"
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab.key)}
            >
              {/* Animated Background */}
              <AnimatePresence>
                {isActive && (
                  <MotiView
                    from={{ scale: 0.95, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0.5 }}
                    transition={{ type: "timing", duration: 250 }}
                    className="absolute left-0 right-0 top-0 bottom-0 bg-blue-600 rounded-2xl z-0"
                  />
                )}
              </AnimatePresence>

              {/* Tab Label */}
              <View className="relative z-10">
                <Text
                  className={`text-base font-semibold ${
                    isActive ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      <View className="flex-1 min-h-[120px]">
        <AnimatePresence exitBeforeEnter>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return isActive ? (
              <MotiView
                key={tab.key}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                transition={{ type: "timing", duration: 350 }}
                className="p-4"
              >
                {tab.content}
              </MotiView>
            ) : null;
          })}
        </AnimatePresence>
      </View>
    </View>
  );
};

export default TabsView;
