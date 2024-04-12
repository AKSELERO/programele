import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, ViewStyle, View, Pressable, ImageProps } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Screen, Text } from "app/components"
import { colors, spacing } from "../theme"

//Image imports
const Sitting = require("../../assets/images/Rekomendacijos/Sitting.png");
const Standing = require("../../assets/images/Rekomendacijos/Standing.png"); 
const Running = require("../../assets/images/Rekomendacijos/Running.png"); 
const Lying = require("../../assets/images/Rekomendacijos/Lying.png"); 
const Walking = require("../../assets/images/Rekomendacijos/Walking.png"); 

interface RekomendacijosScreenProps extends AppStackScreenProps<"Rekomendacijos"> {}

const StyledCard: FC<{ label: string, image?: ImageProps }> = ({ label, image }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    console.log("Button clicked");
    // Switch to screen ("KonkretiRekomendacija")
  }

  return (
  <Pressable style={() => [
    $buttonCardStyle,
    {
      backgroundColor: isPressed ? colors.palette.neutral300 : colors.palette.neutral100,
    },
    ]} onPressIn={() => {setIsPressed(true)}} onPressOut={() => {setIsPressed(false)}} onPress={handleClick}>
    <Image source={image} style={$imageStyle}></Image>
    <Text style={$buttonLabel} preset="formLabel">{label}</Text>
  </Pressable>
  );
};

export const RekomendacijosScreen: FC<RekomendacijosScreenProps> = observer(function RekomendacijosScreen() {
  return (
    <Screen safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Rekomendacijos" />
      <View style={$cardsContainer}>
        <StyledCard label="Sėdėjimas" image={Sitting}></StyledCard>
        <StyledCard label="Vaikščiojimas" image={Walking}></StyledCard>
        <StyledCard label="Stovėjimas" image={Standing}></StyledCard>
        <StyledCard label="Bėgimas" image={Running}></StyledCard>
        <StyledCard label="Gulėjimas" image={Lying}></StyledCard>
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
  alignItems: "flex-start",
}

const $buttonCardStyle: ViewStyle = {
  width: '45%',
  elevation: 4,
  padding: null,
  borderRadius: 8,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  margin: spacing.xs
}

const $imageStyle: ImageStyle = {
  resizeMode: 'contain',
  maxHeight: 80,
  width: 80,
  marginVertical: spacing.sm
}

const $buttonLabel: TextStyle = {
  marginBottom: spacing.xs
}
