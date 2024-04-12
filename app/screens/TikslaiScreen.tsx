import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface TikslaiScreenProps extends AppStackScreenProps<"Tikslai"> {}

interface Goal {
  name: string
  enabled: boolean
  timeframe?: number // Hours
  moreThan?: boolean // Is the goal less than or more than specified hours
  goalHours?: number // Goal, specified in hours
}

const initGoals = [
  {
    name: "Vaikščiojimas",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2
  },
  {
    name: "Bėgiojimas",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2
  },
  {
    name: "Sėdėjimas",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2
  },
  {
    name: "Stovėjimas",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2
  },
  {
    name: "Gulėjimas",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2
  },
]

export const TikslaiScreen: FC<TikslaiScreenProps> = observer(function TikslaiScreen() {
  const [goalData, setGoalData] = useState<Goal[]>(initGoals)

  const renderGoal = (goal: Goal) => {
    return (
      <Text key={goal.name}>{goal.name}</Text>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Tikslų redagavimas" />

      {goalData.map((goal) => {
        return renderGoal(goal);
      })}
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.lg,
}