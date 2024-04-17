import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { colors, spacing } from "../theme"
import DatePicker from 'react-native-date-picker'

interface StatistikaScreenProps extends AppStackScreenProps<"Statistika"> { }

interface DateRange {
  start: Date,
  end: Date
}

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};


export const StatistikaScreen: FC<StatistikaScreenProps> = observer(function StatistikaScreen() {
  // Get the current date
  const currentDate = new Date();

  // Get the date for 7 days ago
  const sevenDaysAgo = new Date(currentDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [statisticsDateRange, setStatisticsDateRange] = useState<DateRange>({
    start: sevenDaysAgo,
    end: currentDate,
  });

  const StatisticsRange = () => {
    const [openStartDatepicker, setOpenStartDatepicker] = useState(false)
    const [openEndDatepicker, setOpenEndDatepicker] = useState(false)

    return (
      <><View style={$dateRangeContainer}>
        <Text style={$datePressable} onPress={() => setOpenStartDatepicker(true)} >{formatDate(statisticsDateRange.start)}</Text>
        <Text> - </Text>
        <Text style={$datePressable} onPress={() => setOpenEndDatepicker(true)} >{formatDate(statisticsDateRange.end)}</Text>
      </View>

        <DatePicker
          modal
          mode="date"
          title="Pasirinkite laikotarpio pradžią"
          confirmText="Patvirtinti"
          cancelText="Atšaukti"
          theme="light"
          maximumDate={statisticsDateRange.end}
          open={openStartDatepicker}
          date={statisticsDateRange.start}
          onConfirm={(date) => {
            setOpenStartDatepicker(false)
            setStatisticsDateRange({ ...statisticsDateRange, start: date })
          }}
          onCancel={() => {
            setOpenStartDatepicker(false)
          }}
        />
        <DatePicker
          modal
          mode="date"
          title="Pasirinkite laikotarpio pabaigą"
          confirmText="Patvirtinti"
          cancelText="Atšaukti"
          theme="light"
          minimumDate={statisticsDateRange.start}
          maximumDate={new Date()}
          open={openEndDatepicker}
          date={statisticsDateRange.end}
          onConfirm={(date) => {
            setOpenEndDatepicker(false)
            setStatisticsDateRange({ ...statisticsDateRange, end: date })
          }}
          onCancel={() => {
            setOpenEndDatepicker(false)
          }}
        /></>
    );
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Statistika" />
      <StatisticsRange></StatisticsRange>

    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.lg,
}

const $dateRangeContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row"
}

const $datePressable: TextStyle = {
  textDecorationLine: "underline",
  color: colors.palette.primary500
}