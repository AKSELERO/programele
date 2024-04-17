import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { colors, spacing } from "../theme"

interface StatistikaScreenProps extends AppStackScreenProps<"Statistika"> { }

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const StatistikaScreen: FC<StatistikaScreenProps> = observer(function StatistikaScreen() {
  // Get the current date
  const currentDate = new Date();

  // Get the date for 7 days ago
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [statisticsDateRange, setStatisticsDateRange] = useState({
    start: formatDate(sevenDaysAgo),
    end: formatDate(currentDate),
  });




  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Statistika" />
      <Text>{statisticsDateRange.start} - {statisticsDateRange.end}</Text>
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.lg,
}