import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  RekomendacijosScreen, KonkretiRekomendacijaScreen, SedejimasScreen, BegimasScreen, GulejimasScreen, StovejimasScreen, VaiksciojimasScreen
} from "app/screens"

export type RekomendacijosNavigatorParamList = {
  Rekomendacijos: undefined;
  KonkretiRekomendacija: undefined;
  Begimas: undefined;
  Gulejimas: undefined;
  Sedejimas: undefined;
  Stovejimas: undefined;
  Vaiksciojimas: undefined;
}

const Stack = createNativeStackNavigator<RekomendacijosNavigatorParamList>()
export const RekomendacijosNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: "transparent" }, headerShown: false, }}>
      <Stack.Screen name="Rekomendacijos" component={RekomendacijosScreen} />
      <Stack.Screen name="Begimas" component={BegimasScreen} />
      <Stack.Screen name="Gulejimas" component={GulejimasScreen} />
      <Stack.Screen name="Sedejimas" component={SedejimasScreen} />
      <Stack.Screen name="Stovejimas" component={StovejimasScreen} />
      <Stack.Screen name="Vaiksciojimas" component={VaiksciojimasScreen} />
      <Stack.Screen name="KonkretiRekomendacija" component={KonkretiRekomendacijaScreen} />
    </Stack.Navigator>
  )
}
