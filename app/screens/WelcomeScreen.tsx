import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import {
  Button, // @demo remove-current-line
  Text,
} from "app/components"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("../../assets/images/GlimLogoTransparentText.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> { }

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} })
  }

  // @demo remove-block-end

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <View style={$container}>
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <View style={$welcomeTextHeading}>
          <Text
            testID="welcome-heading"
            style={$welcomeHeading}
            text="Sveikiname atvykus!"
            preset="heading"
          />
          <Text text="Tai pirmas žingsnis į geros savijautos rytojų." style={$welcomeHeading} preset="subheading" />
        </View>
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text text="Įvesk savo sveikatingumo tikslus, o mes tau padėsime juos įvykdyti!" size="md" />
        {/* @demo remove-block-start */}
        <Button
          style={$buttonStyle}
          testID="next-screen-button"
          preset="reversed"
          text="Važiuojam!"
          onPress={goNext}
        />
        {/* @demo remove-block-end */}
      </View>
    </View>
  )
})

const $buttonStyle: ViewStyle = {
  backgroundColor: "#006622",

}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 150,
  width: "100%",
  marginBottom: spacing.xl,
}


const $welcomeTextHeading: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.md,
  textAlign: "center"
}
