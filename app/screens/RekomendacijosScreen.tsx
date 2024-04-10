import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "../theme"

interface RekomendacijosScreenProps extends AppStackScreenProps<"Rekomendacijos"> {}

export const RekomendacijosScreen: FC<RekomendacijosScreenProps> = observer(function RekomendacijosScreen() {
  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Rekomendacijos" />
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.lg,
}
