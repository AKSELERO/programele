import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Button, TextField, Text, Toggle, ToggleProps } from "app/components"
import { colors, spacing } from "../theme"
import { load, save } from "app/utils/storage"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface TikslaiScreenProps extends AppStackScreenProps<"Tikslai"> { }

interface Goal {
  id: number
  name: string
  bendratis: string
  enabled: boolean
  timeFrame?: number // Hours
  moreThan?: boolean // Is the goal less than or more than specified hours
  goalHours?: number // Goal, specified in hours
}

const initGoals = [
  {
    name: "Vaikščiojimas",
    bendratis: "vaikščioti",
    enabled: true,
    timeFrame: 24,
    moreThan: true,
    goalHours: 3,
    id: 0
  },
  {
    name: "Bėgiojimas",
    bendratis: "bėgioti",
    enabled: true,
    timeFrame: 24,
    moreThan: true,
    goalHours: 1,
    id: 1
  },
  {
    name: "Sėdėjimas",
    bendratis: "sėdėti",
    enabled: true,
    timeFrame: 24,
    moreThan: false,
    goalHours: 4,
    id: 2
  },
  {
    name: "Stovėjimas",
    bendratis: "stovėti",
    enabled: true,
    timeFrame: 24,
    moreThan: true,
    goalHours: 4,
    id: 3
  },
  {
    name: "Gulėjimas",
    bendratis: "gulėti",
    enabled: true,
    timeFrame: 24,
    moreThan: false,
    goalHours: 12,
    id: 4
  },
]

// Toggle button
function ControlledToggle({ value, onChange, ...props }: ToggleProps & { value: boolean; onChange: (newValue: boolean) => void }) {
  return <Toggle {...props} value={value} onPress={() => onChange(!value)} />;
}

export const TikslaiScreen: FC<TikslaiScreenProps> = observer(function TikslaiScreen() {
  const [goalData, setGoalData] = useState<Goal[]>(initGoals)

  const loadGoals = async () => {
    const goals: Goal[] = await load("goals");
    if (goals) {
      // console.log("Loaded goals: " + JSON.stringify(goals));
      console.log("Successfully loaded goals")
      setGoalData(goals);
    } else {
      console.log("Couldn't load goals, initialising new ones");
      saveGoals(initGoals);
    }
  }

  const saveGoals = (goalData: Goal[]) => {
    // console.log("Saving goals: " + JSON.stringify(goalData));
    console.log("Saving goals");
    save("goals", goalData)
  }

  useEffect(() => {
    loadGoals();
  }, [])

  const updateGoal = (id: number, changes: {}) => {
    const updatedGoals = goalData.map(goal => {
      if (goal.id === id) {
        return { ...goal, ...changes };
      }
      return goal;
    });
    setGoalData(updatedGoals);
    saveGoals(updatedGoals)
  };

  const renderGoal = (goal: Goal) => {
    const ExpandedGoal = () => {
      const [localGoalHours, setLocalGoalHours] = useState(goal.goalHours.toString());

      const handleGoalHoursChange = (text: string) => {
        // Replace commas with dots, allow only numbers and a single dot
        const normalizedText = text.replace(/,/g, '.'); // Replace commas with dots
        const filteredText = normalizedText.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); // Remove non-numeric characters and ensure only one dot

        // Update the local state with the filtered text
        setLocalGoalHours(filteredText);
      };


      if (goal.enabled) {
        return (
          <View style={$expandedContainer}>
            <Text>Per {goal.timeFrame}h noriu {goal.bendratis} {goal.moreThan ? "daugiau" : "mažiau"} nei {goal.goalHours}h</Text>
            <View style={$dividerContainer}>
              <View style={$divider}></View>
            </View>
            <View style={$optionRow}>
              <Text>Tikslo tipas</Text>
              <Button
                text={goal.moreThan ? "daugiau" : "mažiau"}
                onPress={() => updateGoal(goal.id, { moreThan: !goal.moreThan })}
                preset="option"
              />
            </View>

            <View style={$optionRow}>
              <Text>Tikslas valandomis</Text>
              <TextField
                inputWrapperStyle={$goalHoursInputContainer}
                keyboardType="numeric"
                onChangeText={handleGoalHoursChange}
                onBlur={
                  () => { updateGoal(goal.id, { goalHours: parseFloat(localGoalHours) }) }
                }
                value={localGoalHours}
              />
            </View>
          </View>
        );
      }

    }

    return (
      <View key={goal.id} style={$singleGoalContainer}>
        <ControlledToggle
          variant="switch"
          label={goal.name}
          inputOuterStyle={{ backgroundColor: colors.palette.neutral600 }}
          labelPosition="left"
          LabelTextProps={{ size: "md" }}
          containerStyle={{ backgroundColor: colors.palette.neutral100, padding: spacing.md, borderRadius: 8, borderColor: colors.palette.neutral600, borderBottomWidth: 1 }}
          value={goal.enabled}
          onChange={() => { updateGoal(goal.id, { enabled: !goal.enabled }) }}
        />
        <ExpandedGoal></ExpandedGoal>
      </View>
    )
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Tikslų redagavimas" />

      <View style={$goalsContainer}>
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

const $goalsContainer: ViewStyle = {
  display: "flex",
  gap: spacing.sm
}

const $singleGoalContainer: ViewStyle = {
  borderRadius: 8,
  elevation: 4,
  backgroundColor: colors.palette.neutral200,
}

const $dividerContainer: ViewStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

const $divider: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  width: "90%",
  height: 1,
}

const $expandedContainer: ViewStyle = {
  padding: spacing.xs,
  display: "flex",
  alignItems: "center",
  gap: spacing.xs,
  marginBottom: spacing.sm
}

const $optionRow: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.palette.neutral200,
  elevation: 4,
  padding: spacing.xs,
  borderRadius: 8,
  width: "95%"
}

const $goalHoursInputContainer: ViewStyle = {
  borderRadius: 8,
  borderColor: colors.palette.neutral700,
  borderWidth: 1,
  width: 100
}