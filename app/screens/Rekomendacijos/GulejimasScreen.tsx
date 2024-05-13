import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface GulejimasScreenProps extends AppStackScreenProps<"Gulejimas"> { }

export const GulejimasScreen: FC<GulejimasScreenProps> = observer(function GulejimasScreen() {
  return (
    <Screen safeAreaEdges={["top"]} preset="scroll" contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Gulėjimas" />
      <View style={$reccomendationsContainer}>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Trumpai"></Text>
          <Text text="Kadangi rekomenduojamas miego laikas per parą yra 8 valandos, nepertraukiamas gulėjimo laikas neturėtų būti trumpesnis. Neskaitant miego, gulint rekomenduojama praleisti kuo mažiau laiko."></Text>
        </View>

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

const $reccomendationsContainer: ViewStyle = {
  display: "flex",
  gap: spacing.lg
}

const $bottomBorder: ViewStyle = {
  borderBottomColor: colors.palette.primary500,
  borderBottomWidth: 2,
  width: 250,
  alignSelf: "center"
}

const $reccomendationSection: ViewStyle = {
  display: "flex",
  gap: spacing.xs
}

const $bulletListContainer: ViewStyle = {
  display: "flex",
  gap: spacing.xxs,
  paddingLeft: spacing.sm
}

const $imageContainer: ViewStyle = {
  display: "flex",
  alignItems: "center"
}

const $image: ViewStyle = {
  width: 300,
  height: 300
}