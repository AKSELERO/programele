import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, TextStyle, View, ViewStyle } from "react-native"
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
          <Text text="Vidutiniškai žmogus per dieną sėdi 8 valandas. Kad būtų išvengtos sėdėjimo keliamos sveikatos problemos, rekomenduojama bent 150 minučių per savaitę užsiimti vidutinio intensyvumo sportu."></Text>
        </View>

        <View style={$bottomBorder}>

        </View>

        <View style={$imageContainer}>
          <Image source={require("../../../assets/images/Rekomendacijos/sittingPosture.png")} style={$image}></Image>
          <Text text="Taisyklingas sėdėjimas"></Text>
        </View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Patarimai"></Text>
          <Text text="Išvengti ilgo sėdėjimo darbovietėse galite šių rekomendacijų pagalba:"></Text>

          <View style={$bulletListContainer}>
            <Text text={`\u2022 naudoti tiek sėdimus, tiek stovimus darbastalius`}></Text>
            <Text text={`\u2022 kas 30 minučių keisti padėtį iš sėdimos į stovimą`}></Text>
            <Text text={`\u2022 rengti darbo susitikimus vaikštant`}></Text>
            <Text text={`\u2022 reguliariai pratempti raumenis`}></Text>
            <Text text={`\u2022 nueiti pokalbėti su kolega gyvai vietoj elektroninio laiško siuntimo`}></Text>
          </View>
        </View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Sėdėjimo rizika"></Text>
          <Text text="Ilgas laikas praleistas sėdint kelia riziką išsivystyti sveikatos problemoms."></Text>
          <View style={$bulletListContainer}>
            <Text text={`\u2022 Maža rizika - <4 valandos per parą`}></Text>
            <Text text={`\u2022 Vidutinė rizika - 4-8 valandos per parą`}></Text>
            <Text text={`\u2022 Didelė rizika - 8-11 valandų per parą`}></Text>
            <Text text={`\u2022 Labai didelė rizika - daugiau nei 11 valandų per parą`}></Text>
          </View>
        </View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Ilgo sėdėjimo diskomfortas"></Text>
          <Text text="Ilgą laiką praleidžiant vienoje pozicijoje, tam tikrose kūno dalyse gali atsirasti diskomfortas, skausmas. Diskomfortas dėl per ilgo sėdėjimo gali būti jaučiamas šiose srityse:"></Text>
          <View style={$bulletListContainer}>
            <Text text={`\u2022 kaklas`}></Text>
            <Text text={`\u2022 pečiai`}></Text>
            <Text text={`\u2022 kojos`}></Text>
            <Text text={`\u2022 apatinė nugaros dalis`}></Text>
            <Text text={`\u2022 šlaunys`}></Text>
            <Text text={`\u2022 rankos ir riešai`}></Text>
          </View>
        </View>

        <View style={$reccomendationSection}>
          <Text preset="subheading" text="Sveikatos problemos, kurias gali sukelti per ilgas sėdėjimas"></Text>
          <View style={$bulletListContainer}>
            <Text text={`\u2022 širdies ligos`}></Text>
            <Text text={`\u2022 viršsvoris`}></Text>
            <Text text={`\u2022 vėžys`}></Text>
            <Text text={`\u2022 miego sutrikimai`}></Text>
            <Text text={`\u2022 demencija`}></Text>
            <Text text={`\u2022 kraujagyslių ligos (venų varikozė)`}></Text>
            <Text text={`\u2022 nerimas`}></Text>
            <Text text={`\u2022 nugaros problemos`}></Text>
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