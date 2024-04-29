import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle, TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { colors, spacing, typography } from "../theme"
import DatePicker from 'react-native-date-picker'
import { BarChart, PieChart, } from "react-native-gifted-charts";
import { load, } from '../utils/storage/storage';
import { StoredData } from "./StateHistory"

// Fake duomenys stulpelinei diagramai
// Value valandu skaicius, goalReached ar pasiektas tos dienos tikslas
// Masyvo ilgis realiai gali but bet koks, tiesiog 1 obj per diena
const barChartData = [
  { value: 4.2, goalReached: true },
  { value: 5.6, goalReached: true },
  { value: 1.2, goalReached: false },
  { value: 0.8, goalReached: false },
  { value: 1.9, goalReached: false },
  { value: 4.8, goalReached: true },
  { value: 0.65, goalReached: false },
  { value: 4.6, goalReached: true },
]

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

const formatDateShort = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${month}-${day}`
};


export const StatistikaScreen: FC<StatistikaScreenProps> = observer(function StatistikaScreen() {
  const [data, setData] = useState<StoredData[]>([]);
  const [loading, setLoading] = useState(true);
  const [prevEntryCount, setPrevEntryCount] = useState(0);

  const fetchData = async () => {
    console.log("Loading data for statistics");
    try {
      const count = Number((await load('entryCount')) || 0);

      if (count > prevEntryCount) {
        const fetchedData: StoredData[] = [];
        for (let i = prevEntryCount + 1; i <= count; i++) {
          const key = `dataKey${i}`;
          const storedData = await load(key);

          if (storedData) {
            fetchedData.push(storedData as StoredData);
            console.log(`Read data from key ${key}:`, storedData);
          } else {
            console.log(`No data found for key ${key}`);
          }
        }

        if (fetchedData.length > 0) {
          console.log('New entries found. Updating data...');
          setData((prevData) => [...prevData, ...fetchedData]);
        }

        setPrevEntryCount(count);
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

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

    const calculatePieChartData = (data: StoredData[], range: DateRange) => {
      const timePerDataPointInSeconds = 15; // each data point represents 15 seconds
      const activityDuration = data.reduce((acc, curr) => {
        const dataDate = new Date(curr.date);
        if (dataDate >= range.start && dataDate <= range.end) {
          const activity = curr.content || "Be kategorijos"; // Default category if none provided
          acc[activity] = (acc[activity] || 0) + timePerDataPointInSeconds;
        }
        return acc;
      }, {} as Record<string, number>);

      const pieChartData = Object.entries(activityDuration).map(([key, value]) => {
        // Ensure value is a number and not undefined or null
        const hours = value ? (value / 3600).toFixed(2) : "0.00";
        return { text: key, value: parseFloat(hours) }; // parse it back to a number if needed
      });

      return pieChartData;
    };


    let formattedData = calculatePieChartData(data, statisticsDateRange);

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

  const BarChartSection = () => {
    let formattedData = barChartData

    formattedData = formattedData.map((obj, index) => {
      const currentDate = new Date(statisticsDateRange.start.getTime());
      currentDate.setDate(currentDate.getDate() + index - 1);
      const dateLabel = formatDateShort(currentDate);
      return { ...obj, label: dateLabel, frontColor: obj.goalReached ? colors.palette.primary500 : colors.palette.neutral700, }
    })

    const max = Math.ceil(barChartData.reduce((maxValue, currentItem) => {
      return currentItem.value > maxValue ? currentItem.value : maxValue;
    }, Number.NEGATIVE_INFINITY));

    return (
      <View style={$barChartContainer}>
        <Text style={$barChartTitle} preset="subheading">Bėgimas</Text>
        <View style={$barChartWithLabel}>
          <Text style={$barChartYAxisLabel}>Valandos</Text>
          <BarChart
            barWidth={28}
            data={formattedData}
            frontColor={colors.palette.primary500}
            barBorderTopLeftRadius={8}
            barBorderTopRightRadius={8}
            initialSpacing={spacing.sm}
            spacing={spacing.md}
            xAxisThickness={2}
            scrollToEnd
            maxValue={max}
            noOfSections={Math.min(12, max)}
          />
        </View>
      </View>
    );
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top"]} contentContainerStyle={$container}>
      <Text style={$title} preset="heading" text="Statistika" />
      <StatisticsRange></StatisticsRange>
      <BarChartSection />
      <PieChartSection />
      <Text>Duomenų kiekis: {data.length}</Text>
    </Screen>
  )
})

const $container: ViewStyle = {
  padding: spacing.lg,
  gap: spacing.sm
}

const $title: TextStyle = {
}

const $dateRangeContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  width: "100%",
  justifyContent: "center",
}

const $datePressable: TextStyle = {
  textDecorationLine: "underline",
  color: colors.palette.primary500
}

const $barChartContainer: ViewStyle = {
  display: "flex",
  justifyContent: "space-around",
  backgroundColor: colors.palette.neutral400,
  borderRadius: 8,
  elevation: 4,
  padding: spacing.sm,
  overflow: "hidden"
}

const $barChartWithLabel: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  paddingLeft: 5
}

const $barChartTitle: ViewStyle = {
  marginBottom: spacing.xs
}

const $barChartYAxisLabel: TextStyle = {
  fontSize: 12,
  position: "absolute",
  transform: [{ rotate: "270deg" }],
  top: 90,
  left: -25
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


