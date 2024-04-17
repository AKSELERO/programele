import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button, TextField, Text, Toggle, ToggleProps } from "app/components"
import { colors, spacing } from "../theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface TikslaiScreenProps extends AppStackScreenProps<"Tikslai"> {}

interface Goal {
  id: number
  name: string
  bendratis: string
  enabled: boolean
  timeframe?: number // Hours
  moreThan?: boolean // Is the goal less than or more than specified hours
  goalHours?: number // Goal, specified in hours
}

const initGoals = [
  {
    name: "Vaikščiojimas",
    bendratis: "vaikščioti",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2,
    id: 0
  },
  {
    name: "Bėgiojimas",
    bendratis: "bėgioti",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2,
    id: 1
  },
  {
    name: "Sėdėjimas",
    bendratis: "sėdėti",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2,
    id: 2
  },
  {
    name: "Stovėjimas",
    bendratis: "stovėti",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2,
    id: 3
  },
  {
    name: "Gulėjimas",
    bendratis: "gulėti",
    enabled: false,
    timeFrame: 24,
    moreThan: true,
    goalHours: 2,
    id: 4
  },
]

// Toggle button
function ControlledToggle({ value, onChange, ...props }: ToggleProps & { value: boolean; onChange: (newValue: boolean) => void }) {
  return <Toggle {...props} value={value} onPress={() => onChange(!value)} />;
}

export const TikslaiScreen: FC<TikslaiScreenProps> = observer(function TikslaiScreen() {
  const [goalData, setGoalData] = useState<Goal[]>(initGoals)

  const renderGoal = (goal: Goal) => {

    const handleToggle = (goalId: number) => {
      const updatedGoals = goalData.map((goal) => {
        if (goal.id == goalId) {
          return {...goal, enabled: !goal.enabled};
        }

        return goal
      })

      setGoalData(updatedGoals);
    }

    const ExpandedGoal = () => {
      if (goal.enabled) {
        return (
          <View>
            <Text>Laiko tarpas</Text>
            <Text>Tikslo tipas</Text>
            <Text>Tikslas valandomis</Text>
            <View style={$dividerContainer}>
              <View style={$divider}></View>
            </View>
            <Text>Per {goal.timeframe}h noriu {goal.bendratis} ne {goal.moreThan ? "daugiau" : "mažiau"} nei {goal.goalHours}h</Text>
          </View>
        );
      }
      return
    }

    return (
    <View key={goal.id}>
      <ControlledToggle
        variant="switch"
        label={goal.name}
        inputOuterStyle={{ backgroundColor: colors.palette.neutral600 }}
        labelPosition="left"
        LabelTextProps={{ size: "md" }}
        containerStyle={{ backgroundColor: colors.palette.neutral100, elevation: 4, padding: spacing.md, borderRadius: 8}}
        value={goal.enabled}
        onChange={() => {handleToggle(goal.id)}}
      />
      <ExpandedGoal></ExpandedGoal>
    </View>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Tikslų redagavimas" />

      <View style={$goalContainer}>
        {goalData.map((goal) => {
          return renderGoal(goal);
        })}
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

const $goalContainer: ViewStyle = {
  display: "flex",
  gap: spacing.sm
}

const $dividerContainer: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginVertical: spacing.sm
}

const $divider: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  width: "90%",
  height: 1,
}