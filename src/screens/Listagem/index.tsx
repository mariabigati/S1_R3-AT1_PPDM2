import { Alert, View } from "react-native";
import api from "../../api/api";
import { useState } from "react";

type Dinossauro = {
  "id": number,
  "name": string,
  "temporalRange": string,
  "diet": string,
  "locomotionType": string,
  "description": string,
  "classificationInfo": string,
  "image": string,
  "source": string
}

export default function Listagem() {
    
    const [dinos, setDinos] = useState<Dinossauro[]>([])

    async function loadData() {
        try {
            const response = await api.get("/dinosaurs?page=1")
            const data = response.data
            setDinos(data)
            console.log(response)
        } catch (error) {
            Alert.alert("Erro!", "Não foi possível carregar os dados.")
        }        
    }
    return (
        <View>
            
        </View>
    )
}