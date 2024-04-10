// Screenui generuoti buvo naudojama "npx ignite-cli generate screen Nustatymai"

import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface NustatymaiScreenProps extends AppStackScreenProps<"Nustatymai"> {}

export const NustatymaiScreen: FC<NustatymaiScreenProps> = observer(function NustatymaiScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="nustatymai" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
