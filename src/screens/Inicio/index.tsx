import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Inicio({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}></Text>
      <Text style={styles.titulo}>DinoApps</Text>
      <View style={styles.linhaVerde} />
      <Text style={styles.subtitulo}> EXPLORE O MUNDO DOS DINOSSAUROS</Text>
      <Text style={styles.descricao}>
        Descubra diferentes espécies de dinossauros e
        conheça suas características, períodos, dietas
        e muito mais.
      </Text>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Listagem')}
      >
        <Text style={styles.textoBotao}>
          EXPLORAR DINOSSAUROS
        </Text>

        <Text style={styles.seta}> → </Text>
      </TouchableOpacity>
      <Text style={styles.rodape}>  Dados fornecidos pela RESTasaurus API</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#0B3540',
  },

  emoji: {
    fontSize: 80,
    marginBottom: 15,
  },

  titulo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#F1F1F1',
    letterSpacing: 1,
    marginBottom: 10,
  },

  linhaVerde: {
    width: 80,
    height: 3,
    backgroundColor: '#67E88A',
    marginBottom: 20,
  },

  subtitulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#67E88A',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 18,
  },

  descricao: {
    fontSize: 16,
    lineHeight: 25,
    textAlign: 'center',
    color: '#D8E2E4',
    marginBottom: 35,
    maxWidth: 330,
  },

  botao: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#67E88A',
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoBotao: {
    color: '#082A34',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  seta: {
    color: '#082A34',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  rodape: {
    position: 'absolute',
    bottom: 25,
    color: '#6F8A90',
    fontSize: 12,
    textAlign: 'center',
  },
});