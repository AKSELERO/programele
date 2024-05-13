import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  RekomendacijosScreen
  , KonkretiRekomendacijaScreen
} from "app/screens"

export type RekomendacijosNavigatorParamList = {
  Rekomendacijos: undefined;
  KonkretiRekomendacija: undefined;
}

const Stack = createNativeStackNavigator<RekomendacijosNavigatorParamList>()
export const RekomendacijosNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false, }}>
      <Stack.Screen name="Rekomendacijos" component={RekomendacijosScreen} />
      <Stack.Screen name="KonkretiRekomendacija" component={KonkretiRekomendacijaScreen} />
    </Stack.Navigator>
  )
}
