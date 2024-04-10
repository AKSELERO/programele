// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Linking, Platform, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, ListItem, Screen, Text, Toggle, ToggleProps } from "../components"
import { colors, spacing } from "../theme"
import { DemoDivider } from "./DemoShowroomScreen/DemoDivider"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NustatymaiScreenProps extends AppStackScreenProps<"Nustatymai"> {}

// Toggle button
function ControlledToggle(props: ToggleProps) {
  const [value, setValue] = React.useState(props.value || false)
  return <Toggle {...props} value={value} onPress={() => setValue(!value)} />
}

export const NustatymaiScreen: FC<NustatymaiScreenProps> = observer(function NustatymaiScreen() {
  let toggleColorBgOff = colors.palette.neutral600;
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Nustatymai" />
      <View style={$optionsContainer}>
        <ControlledToggle
            variant="switch"
            label="Nustatymas 1"
            helper="Aprašo nustatymą 1."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
        <ControlledToggle
            variant="switch"
            label="Nustatymas 2"
            helper="Aprašo nustatymą 2."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
        <ControlledToggle
            variant="switch"
            label="Nustatymas 3"
            helper="Aprašo nustatymą 3."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
        <ControlledToggle
            variant="switch"
            label="Nustatymas 4"
            helper="Aprašo nustatymą 4."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
        <ControlledToggle
            variant="switch"
            label="Nustatymas 5"
            helper="Aprašo nustatymą 5."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
        <ControlledToggle
            variant="switch"
            label="Nustatymas 6"
            helper="Aprašo nustatymą 6."
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        />
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.lg,
}

const $optionsContainer: ViewStyle = {
  display: "flex",
  gap: spacing.sm
}
