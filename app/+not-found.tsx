import { router, Stack } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View className="flex-1 items-center justify-center p-5 gap-4">
                <Text className="text-xl font-semibold">This screen doesnt exist.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text>Go Back !</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}
