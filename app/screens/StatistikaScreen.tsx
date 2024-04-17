import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { colors, spacing, typography } from "../theme"
import DatePicker from 'react-native-date-picker'
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";

const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]

// Fake duomenys skritulinei diagramai
const pieChartData = [
  { text: "Gulėjimas", value: 8.5 }, // Gulėjimas
  { text: "Sėdėjimas", value: 9 }, // Sėdėjimas
  { text: "Bėgimas", value: 0.4 }, // Bėgimas
  { text: "Ėjimas", value: 1.4 }, // Ėjimas
  { text: "Stovėjimas", value: 3 }, // Stovėjimas
  { text: "Be kategorijos", value: 1.7 } // Be kategorijos
]

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

  const PieChartSection = () => {
    const chartColors = ["#d92626", "#d9a326", "#afd926", "#26cdd9", "#2656d9", "#c126d9"];
    let formattedData = pieChartData

    formattedData = formattedData.map((obj, index) => {
      return { ...obj, color: chartColors[index % chartColors.length] }
    })

    return (
      <View style={$pieChartContainer}>
        <PieChart
          donut
          strokeWidth={3}
          innerCircleBorderWidth={3}
          innerCircleBorderColor={colors.palette.neutral400}
          strokeColor={colors.palette.neutral400}
          data={formattedData}
          radius={80}
        />
        <View>
          {formattedData.map((value) => {
            return (
              <View style={$legendItem} key={value.text}>
                <View style={[$colorSwatch, {
                  backgroundColor: value.color
                }]} />
                <View>
                  <Text style={$legendTitle}>{value.text}</Text>
                  <Text style={$legendSubtitle}>{value.value}h</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    );
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Statistika" />
      <StatisticsRange></StatisticsRange>
      {/* <BarChart data={data} /> */}
      <PieChartSection />
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

const $pieChartContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  backgroundColor: colors.palette.neutral400,
  borderRadius: 8,
  elevation: 4,
  paddingVertical: spacing.sm
}

const $legendItem: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  gap: spacing.xs
}

const $colorSwatch: ViewStyle = {
  width: 20,
  height: 20,
  borderRadius: 8,
  top: 4
}

const $legendTitle: TextStyle = {
  fontFamily: typography.primary.semiBold,
}

const $legendSubtitle: TextStyle = {
  fontFamily: typography.primary.light,
  fontSize: 12
}


