import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, ViewStyle, View, Pressable, ImageProps } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen, Text } from "app/components"
import { colors, spacing } from "../theme"

//Image imports
const Sitting = require("../../assets/images/Rekomendacijos/Sitting.png"); 

interface RekomendacijosScreenProps extends AppStackScreenProps<"Rekomendacijos"> {}

// Styled card component that wraps the Card component and preapplies default values/styles
const StyledCard: FC<{ label: string, image?: ImageProps }> = ({ label, image }) => (
  <View style={{ width: '45%', margin: spacing.xs }}>
    <Button preset="default" style={$buttonCardStyle}>
      <Image source={image} style={$imageStyle}></Image>
      <Text style={$buttonLabel} preset="formLabel">{label}</Text>
    </Button>
  </View>
);

export const RekomendacijosScreen: FC<RekomendacijosScreenProps> = observer(function RekomendacijosScreen() {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Rekomendacijos" />
      <View style={$cardsContainer}>
        <StyledCard label="Sėdėjimas" image={Sitting}></StyledCard>
        <StyledCard label="Vaikščiojimas"></StyledCard>
        <StyledCard label="Stovėjimas"></StyledCard>
        <StyledCard label="Bėgimas"></StyledCard>
        <StyledCard label="Gulėjimas"></StyledCard>
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

const $cardsContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "flex-start"
}

const $buttonCardStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  elevation: 4,
  padding: null,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
}

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
  height: 100,
  width: 100,
}

const $buttonLabel: TextStyle = {
}
