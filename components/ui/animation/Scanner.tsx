import LottieView from "lottie-react-native";
import React from "react";
import { Button, View } from "react-native";

const animation = React.useRef<LottieView>(null);

const Scanner = () => {
    return (
        <View className="flex-1 items-center justify-center">
            <LottieView
                ref={animation}
                source={require("../../../assets/scanner.json")}
                autoPlay={false}
                loop={false}
            />
            <Button
                title="Play"
                onPress={() => animation.current?.play()}
            />
        </View>
    );
};

export default Scanner;
