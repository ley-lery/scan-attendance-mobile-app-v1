import { Ionicons } from '@expo/vector-icons';

export const StudentTabs = {
  home: ({ color, size, focused }: any) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />,
  history: ({ color, size, focused }: any) => <Ionicons name={focused ? "time" : "time-outline"} color={color} size={size} />,
  scan: ({ color, size, focused }: any) => <Ionicons name={focused ? "qr-code" : "qr-code-outline"} color={color} size={size} />,
  location: ({ color, size, focused }: any) => <Ionicons name={focused ? "location" : "location-outline"} color={color} size={size} />,
  profile: ({ color, size, focused }: any) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />,
};
export const LecturerTabs = {
  dashboard: ({ color, size, focused }: any) => <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />,
  class: ({ color, size, focused }: any) => <Ionicons name={focused ? "school" : "school-outline"} color={color} size={size} />,
  report: ({ color, size, focused }: any) => <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} color={color} size={size} />,
  profile: ({ color, size, focused }: any) => <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size} />,
}
