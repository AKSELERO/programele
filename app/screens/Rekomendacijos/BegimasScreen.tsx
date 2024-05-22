import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, TextStyle, View, ViewStyle, Linking, Pressable } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface BegimasScreenProps extends AppStackScreenProps<"Begimas"> { }

export const BegimasScreen: FC<BegimasScreenProps> = observer(function BegimasScreen() {
  return (
    <Screen safeAreaEdges={["top"]} preset="scroll" contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Bėgimas" />
      <View style={$reccomendationsContainer}>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Trumpai"></Text>
          <Text text="Optimalus bėgiojimo laikas yra 2.5 valandos per savaitę arba 30 minučių penkias dienas per savaitę."></Text>
        </View>

        <View style={$bottomBorder}></View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Faktai apie bėgiojimą"></Text>
          <Text text="Tyrimai rodo, kad bėgiojimas vidutiniu tempu bent po 5-10 minučių kiekvieną dieną, gali sumažinti:"></Text>
          <View style={$bulletListContainer}>
            <Text text={`\u2022 širdies smūgio riziką`}></Text>
            <Text text={`\u2022 širdies ir kraujagyslių ligų riziką`}></Text>
            <Text text={`\u2022 vėžio riziką`}></Text>
            <Text text={`\u2022 neurologinių ligų, tokių kaip Parkinsono liga ir Alzheimerio liga, riziką`}></Text>
          </View>
        </View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Bėgiojimo trukmės pasirinkimas"></Text>
          <Text text="Nebūtina pradėti nuo intensyvių treniruočių ir kasdieninių maratonų. Renkantis bėgimo dažnį, reikia atsižvelgti į savo fizinį pasiruošimą."></Text>
          <View style={$bulletListContainer}>
            <Text text={`\u2022 1-2 kartus per savaitę - tinka pradedantiesiems, besigydantiems po traumos, ligos, žmonėms, turintiems užimtą grafiką`}></Text>
            <Text text={`\u2022 3 kartus per savaitę - tinka bėgikams, daug sportuojantiems`}></Text>
            <Text text={`\u2022 4-5 kartus per savaitę - ilgai bėgiojantiems bėgikams (prabėgantiems nuo 50 iki 80 km per savaitę)`}></Text>
            <Text text={`\u2022 6-7 kartai per savaitę - patyrusiems, pažengusiems bėgikams`}></Text>
          </View>
        </View>
        <Pressable onPress={() => Linking.openURL("https://www.healthline.com/health/fitness-exercise/running-everyday")}>
          <Text style={$link} text="Šaltinis"></Text>
        </Pressable>
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

const $link: TextStyle = {
  color: colors.palette.primary500,
  marginTop: spacing.lg,
  textAlign: "right",
  textDecorationLine: "underline"
}