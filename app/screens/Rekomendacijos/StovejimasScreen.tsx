import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface StovejimasScreenProps extends AppStackScreenProps<"Stovejimas"> { }

export const StovejimasScreen: FC<StovejimasScreenProps> = observer(function StovejimasScreen() {
  return (
    <Screen safeAreaEdges={["top"]} preset="scroll" contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Stovėjimas" />
      <View style={$reccomendationsContainer}>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Trumpai"></Text>
          <Text text="Per dieną rekomenduojama stovėti bent 2 valandas, optimalus laikas - 4 valandos."></Text>
        </View>

        <View style={$bottomBorder}></View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Patarimai"></Text>
          <Text text="Ilgą laiką praleisti stovint gali būti nepatogu, o kartais net ir skausminga. Prailginti savo vidutinį dienos stovėjimo laiką galite šių patarimų pagalba:"></Text>

          <View style={$bulletListContainer}>
            <Text text={`\u2022 jei ilgai stovima, rekomenduojama kas 30 minučių pratempti raumenis`}></Text>
            <Text text={`\u2022 stovint rekomenduojama išlaikyti taisyklingą laikyseną, stovėti ant abiejų kojų`}></Text>
            <Text text={`\u2022 įsigyti stovėjimo stalą`}></Text>
            <Text text={`\u2022 kalbant telefonu išeiti pasivaikščioti`}></Text>
            <Text text={`\u2022 automobilį palikti toliau nuo darbovietės, kad reiktų iki jos paeiti`}></Text>

          </View>
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