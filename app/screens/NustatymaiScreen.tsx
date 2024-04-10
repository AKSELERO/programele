// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"
import React, { useState, FC } from "react"
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
function ControlledToggle({ value, onChange, ...props }: ToggleProps & { value: boolean; onChange: (newValue: boolean) => void }) {
  return <Toggle {...props} value={value} onPress={() => onChange(!value)} />;
}

export const NustatymaiScreen: FC<NustatymaiScreenProps> = observer(function NustatymaiScreen() {
// Centralized state for all toggles
  const [settings, setSettings] = useState({
    setting1: false,
    setting2: false,
    setting3: false,
    setting4: false,
    setting5: false,
    setting6: false,
  });

  // Handler to update state
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };


  let toggleColorBgOff = colors.palette.neutral600;
  
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Nustatymai" />
      <View style={$optionsContainer}>
      {/* Kol kas tiesiog sugeneruojam 6 default nustatymo blokus, kai turėsim actual nustatymus reiks juos sudėt manually */}
      {Object.entries(settings).map(([key, value]) => (
          <ControlledToggle
            key={key}
            variant="switch"
            label={`Nustatymas ${key.charAt(key.length - 1)}`}
            helper={`Aprašo nustatymą ${key.charAt(key.length - 1)}.`}
            inputOuterStyle={{ backgroundColor: colors.palette.neutral600 }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
            value={value}
            onChange={() => handleToggle(key as keyof typeof settings)}
          />
        ))}
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
