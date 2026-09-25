import {
  Alert,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "../../api/api";
import { useEffect, useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../App";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";

type ImageDino = {
  title: string;
  description: string;
  author: string;
  authorURL: string;
  imageURL: string;
  license: string;
  licenseURL: string;
  dateCreated: string;
  dateAccessed: string;
};

export type Dinossauro = {
  id: number;
  name: string | undefined;
  temporalRange: string | undefined;
  diet: string | undefined;
  locomotionType: string | undefined;
  description: string | undefined;
  classificationInfo: string | undefined | object;
  image: ImageDino;
  source: string | undefined | object;
};

export default function Listagem() {

  const [dinos, setDinos] = useState<Dinossauro[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadData();
  }, []);

  function getDirectImageUrl(url: string | undefined): string {
    if (!url) return "";

    if (url.includes("commons.wikimedia.org/wiki/File:")) {
      const fileName = url.split("/File:")[1];

      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
    }
    console.log(url);

    return url;
  }

  async function loadData() {
    try {

        const response = await api.get("/dinosaurs?page=1");
        const data = response.data.data
        const mappedData = data.map((p: any) => ({
          ...p
        }))
        console.log(mappedData)

        setDinos(mappedData);
        console.log(response);

      
    } catch (error) {
      Alert.alert("Erro!", "Não foi possível carregar os dados.");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DINOSSAUROS</Text>
      <Text style={styles.description}>
        Descubra informações INÉDITAS sobre diversos dinossauros!
      </Text>
      <FlatList
        data={dinos}
        keyExtractor={(dino) => String(dino.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Detalhes", { id: item.id })}
          >
            <View>
              <Image
                style={styles.imageDino}
                source={{
                  uri: getDirectImageUrl(item.image.imageURL),
                  headers: {
                    "User-Agent": "DinoApp/1.0r",
                  },
                }}
                contentFit="cover"
                transition={200}
              ></Image>
            </View>

            <View>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3f4967",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    gap: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },

  description: {
    textAlign: "center",
    color: "#ffffff",
  },

  card: {
    display: "flex",
    backgroundColor: "#3f4967",
    borderRadius: 25,
    minHeight: 250,
    minWidth: 250,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    boxShadow: "0 5px 5px rgb(0 0 0 / 0.5);",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#41719e",
  },

  cardText: {
    alignSelf: "flex-end",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },

  imageDino: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
