import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"

interface VaiksciojimasScreenProps extends AppStackScreenProps<"Vaiksciojimas"> { }

export const VaiksciojimasScreen: FC<VaiksciojimasScreenProps> = observer(function VaiksciojimasScreen() {
  return (
    <Screen safeAreaEdges={["top"]} preset="scroll" contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Vaikščiojimas" />
      <View style={$reccomendationsContainer}>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Trumpai"></Text>
          <Text text="Rekomenduojama vaikščioti bent 30 minučių per dieną."></Text>
        </View>

        <View style={$bottomBorder}></View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Patarimai"></Text>
          <Text text="Nesunkiai įtraukti vaikščiojimą į savo dienotvarkę galite šių rekomendacijų pagalba:"></Text>

          <View style={$bulletListContainer}>
            <Text text={`\u2022 rinktis laiptus vietoj lifto`}></Text>
            <Text text={`\u2022 iš viešojo transporto išlipti viena stotele anksčiau`}></Text>
            <Text text={`\u2022 trumpus atstumus eiti pesčiomis, o ne važiuoti`}></Text>
            <Text text={`\u2022 pavedžioti savo (arba kaimyno) šunį`}></Text>
            <Text text={`\u2022 vaikščiojimą paversti rutina (vaikščioti kiekvieną dieną tuo pačiu metu)`}></Text>
            <Text text={`\u2022 vaikščioti su draugais`}></Text>
            <Text text={`\u2022 prisijungti prie vaikščiojimo klubo`}></Text>
            <Text text={`\u2022 naudoti pedometrą žingsnių skaičiavimui (rekomenduojama 10,000 žingsnių per dieną)`}></Text>
            <Text text={`\u2022 keliauti į žygius`}></Text>
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