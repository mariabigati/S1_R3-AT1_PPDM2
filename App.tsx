import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from './src/screens/Inicio';
import Detalhes from './src/screens/Detalhes';
import Listagem from './src/screens/Listagem';

export type RootStackParamList = {
  Inicio: undefined;
  Detalhes: { id: number };
  Listagem: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator>
        <Stack.Screen
          name="Inicio"
          component={Inicio}
        />

        <Stack.Screen
          name="Detalhes"
          component={Detalhes}
        />

        <Stack.Screen
          name="Listagem"
          component={Listagem}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}