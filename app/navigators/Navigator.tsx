import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { NustatymaiScreen, StatistikaScreen, TikslaiScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import DataDisplay from '../screens/StateHistory';
import Setstate from "app/screens/SetState"
import { RekomendacijosNavigator } from "./RekomendacijosNavigator"

export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  DemoDebug: undefined
  DemoPodcastList: undefined
  DataDisplay: undefined
  Nustatymai: undefined
  Rekomendacijos: undefined
  Tikslai: undefined
  Statistika: undefined
  SetState: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function Navigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + spacing.xxxl }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Tikslai"
        component={TikslaiScreen}
        options={{
          tabBarLabel: "Tikslai",
          tabBarIcon: ({ focused }) => (
            <Icon icon="bullseye" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Statistika"
        component={StatistikaScreen}
        options={{
          tabBarLabel: "Statistika",
          tabBarIcon: ({ focused }) => (
            <Icon icon="bargraph" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Rekomendacijos"
        component={RekomendacijosNavigator}
        options={{
          tabBarLabel: "Rekomendacijos",
          tabBarIcon: ({ focused }) => (
            <Icon icon="podcast" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Nustatymai"
        component={NustatymaiScreen}
        options={{
          tabBarLabel: "Nustatymai",
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DataDisplay"
        component={DataDisplay}
        options={{
          tabBarLabel: "Testavimui",
          tabBarIcon: ({ focused }) => (
            <Icon icon="debug" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="SetState"
        component={Setstate}
        options={{
          tabBarLabel: "Testavimui2",
          tabBarIcon: ({ focused }) => (
            <Icon icon="debug" color={focused ? colors.palette.primary400 : colors.palette.primary100} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.palette.primary500,
  borderTopColor: colors.transparent,
  marginBottom: spacing.xs,
  paddingTop: spacing.xs
}

const $tabBarItem: ViewStyle = {
  paddingTop: 0
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
  color: colors.palette.primary100
}
