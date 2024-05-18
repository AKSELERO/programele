// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"
import React, { useState, FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Toggle, ToggleProps } from "../components"
import { colors, spacing } from "../theme"
import { clear, load, save } from "app/utils/storage"

interface NustatymaiScreenProps extends AppStackScreenProps<"Nustatymai"> { }

// Toggle button component
const ControlledToggle: FC<ToggleProps & { value: boolean; onChange: () => void }> = ({ value, onChange, ...props }) => (
  <Toggle {...props} value={value} onPress={onChange} />
);

interface Setting {
  id: number,
  name: string,
  description?: string,
  isTurnedOn: boolean
}

const initSettings: Setting[] = [
  // {
  //   name: "",
  //   description: "",
  //   isTurnedOn: false
  // },
  {
    id: 0,
    name: "Pranešimų siuntimas",
    description: "Ar programėlė turėtų siųsti pranešimus? (Notifications)",
    isTurnedOn: true
  },
  {
    id: 1,
    name: "Trumpos statistikos pranešimai",
    description: "Ar programėlė turėtų siųsti pranešimus su trumpa statistikos apžvalga?",
    isTurnedOn: true
  },
  {
    id: 2,
    name: "Nepasiekto tikslo priminimai",
    description: "Ar programėlė turėtų priminti apie dar nepasiektus dienos tikslus?",
    isTurnedOn: true
  },
  {
    id: 3,
    name: "Pasiekto tikslo sveikinimai",
    description: "Ar programėlė turėtų pranešti apie pasiektą dienos tikslą?",
    isTurnedOn: true
  },
  {
    id: 4,
    name: "Ilgo sėdėjimo perspėjimas",
    description: "Ar programėlė turėtų perspėti apie aptiktą ilgą nenutrauktą sėdėjimą?",
    isTurnedOn: true
  },
]

export const NustatymaiScreen: FC<NustatymaiScreenProps> = observer(function NustatymaiScreen() {
  const [settings, setSettings] = useState<Setting[]>(initSettings);

  const loadSettings = async () => {
    const settings: Setting[] = await load("settings");
    if (settings) {
      // console.log("Loaded goals: " + JSON.stringify(goals));
      console.log("Successfully loaded settings")
      setSettings(settings);
    } else {
      console.log("Couldn't load settings, initialising new ones");
      saveSettings(initSettings);
    }
  }

  const saveSettings = (settingsData: Setting[]) => {
    console.log("Saving settings")
    save("settings", settingsData)
  }

  useEffect(() => {
    loadSettings();
  }, [])

  // Handler to update state
  const handleToggle = (id: number) => {
    let updatedSettings;
    if (id === 0 && settings[0].isTurnedOn) {
      updatedSettings = settings.map(setting => { return { ...setting, isTurnedOn: false } })
    } else {
      updatedSettings = settings.map(setting =>
        setting.id === id ? { ...setting, isTurnedOn: !setting.isTurnedOn } : setting
      );
    }

    setSettings(updatedSettings);
    saveSettings(updatedSettings);
  };

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Nustatymai" />
      <View style={$optionsContainer}>
        {settings.map(setting => (
          <ControlledToggle
            key={setting.id}
            variant="switch"
            label={setting.name}
            helper={setting.description}
            inputOuterStyle={{ backgroundColor: setting.isTurnedOn ? colors.palette.neutral100 : colors.palette.neutral600 }}
            labelPosition="left"

            containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8 }}
            value={setting.isTurnedOn}
            onChange={() => handleToggle(setting.id)}
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
