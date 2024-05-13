// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"
import React, { useState, FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Toggle, ToggleProps } from "../components"
import { colors, spacing } from "../theme"

interface NustatymaiScreenProps extends AppStackScreenProps<"Nustatymai"> { }

// Toggle button
function ControlledToggle({ value, onChange, ...props }: ToggleProps & { value: boolean; onChange: (newValue: boolean) => void }) {
  return <Toggle {...props} value={value} onPress={() => onChange(!value)} />;
}

interface Setting {
  name: string,
  description?: string,
  isTurnedOn: false
}

const initSettings = [
  // {
  //   name: "",
  //   description: "",
  //   isTurnedOn: false
  // },
  {
    name: "Pranešimų siuntimas",
    description: "Ar programėlė turėtų siųsti pranešimus? (Notifications)",
    isTurnedOn: true
  },
  {
    name: "Trumpos statistikos pranešimai",
    description: "Ar programėlė turėtų siųsti pranešimus su trumpa statistikos apžvalga?",
    isTurnedOn: true
  },
  {
    name: "Nepasiekto tikslo priminimai",
    description: "Ar programėlė turėtų priminti apie dar nepasiektus dienos tikslus?",
    isTurnedOn: true
  },
  {
    name: "Pasiekto tikslo sveikinimai",
    description: "Ar programėlė turėtų pranešti apie pasiektą dienos tikslą?",
    isTurnedOn: true
  },
  {
    name: "Ilgo sėdėjimo perspėjimas",
    description: "Ar programėlė turėtų perspėti apie aptiktą ilgą nenutrauktą sėdėjimą?",
    isTurnedOn: true
  },
]

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

  // Styling variables
  const toggleColorBgOff = colors.palette.neutral600;

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
            inputOuterStyle={{ backgroundColor: toggleColorBgOff }}
            labelPosition="left"
            LabelTextProps={{ size: "md" }}
            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8 }}
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
