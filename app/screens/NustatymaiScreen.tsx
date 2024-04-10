// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NustatymaiScreenProps extends AppStackScreenProps<"Nustatymai"> {}

export const NustatymaiScreen: FC<NustatymaiScreenProps> = observer(function NustatymaiScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Nustatymai for real" />
      {/* <View style={$itemsContainer}>
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Id</Text>
              <Text>{Application.applicationId}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Name</Text>
              <Text>{Application.applicationName}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Version</Text>
              <Text>{Application.nativeApplicationVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">App Build Version</Text>
              <Text>{Application.nativeBuildVersion}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Hermes Enabled</Text>
              <Text>{String(usingHermes)}</Text>
            </View>
          }
        />
        <ListItem
          LeftComponent={
            <View style={$item}>
              <Text preset="bold">Fabric Enabled</Text>
              <Text>{String(usingFabric)}</Text>
            </View>
          }
        />
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="demoDebugScreen.reactotron" onPress={demoReactotron} />
        <Text style={$hint} tx={`demoDebugScreen.${Platform.OS}ReactotronHint` as const} />
      </View>
      <View style={$buttonContainer}>
        <Button style={$button} tx="common.logOut" onPress={logout} />
      </View> */}
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,

}

const $title: TextStyle = {
  marginBottom: spacing.xxl,
}

// const $reportBugsLink: TextStyle = {
//   color: colors.tint,
//   marginBottom: spacing.lg,
//   alignSelf: isRTL ? "flex-start" : "flex-end",
// }

// const $item: ViewStyle = {
//   marginBottom: spacing.md,
// }

// const $itemsContainer: ViewStyle = {
//   marginBottom: spacing.xl,
// }

// const $button: ViewStyle = {
//   marginBottom: spacing.xs,
// }

// const $buttonContainer: ViewStyle = {
//   marginBottom: spacing.md,
// }

// const $hint: TextStyle = {
//   color: colors.palette.neutral600,
//   fontSize: 12,
//   lineHeight: 15,
//   paddingBottom: spacing.lg,
// }
