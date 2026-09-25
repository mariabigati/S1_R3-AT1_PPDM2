import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, } from 'react-native';
import { Image } from 'expo-image';
import api from '../../api/api';

export default function Detalhes({ route, navigation }: any) {
    const id = route?.params?.id || 1;

    const [dino, setDino] = useState<any>(null);
    const [descricaoTraduzida, setDescricaoTraduzida] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(true);
    const [traduzindo, setTraduzindo] = useState<boolean>(false);
    const [erro, setErro] = useState<string | null>(null);
    const [imagem, setImagem] = useState<string>('');

    function getDirectImageUrl(url: string | undefined): string {
        if (!url) return "";

        if (url.includes("commons.wikimedia.org/wiki/File:")) {
            const fileName = url.split("/File:")[1];
            return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
        }
        console.log(url);
        return url;
    }

    async function carregarDetalhes() {
        try {
            setCarregando(true);
            setErro(null);
            setDescricaoTraduzida('');
            setImagem('');

            const resposta = await api.get(`/dinosaurs/${id}`);
            const dados = resposta.data?.data || resposta.data?.dinosaur || resposta.data;
            console.log('DINOSSAURO:', dados);
            console.log('IMAGEM DO DINOSSAURO:', dados?.image);
            setDino(dados);
            if (dados?.description) {
                traduzirDescricao(dados.description);
            }
            if (dados?.image?.imageURL) {
                setImagem(getDirectImageUrl(dados.image.imageURL));
            }
        } catch (error) {
            console.log('Erro ao carregar detalhes:', error);
            setErro('Não foi possível carregar os detalhes do dinossauro.');
        } finally {
            setCarregando(false);
        }
    }

    async function traduzirDescricao(texto: string) {
        try {
            setTraduzindo(true);
            const partes = texto.match(/.{1,450}(?:\s|$)/g) || [texto];
            const traducoes = [];
            for (const parte of partes) {
                const resposta = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(parte)}&langpair=en|pt-BR`);
                const dados = await resposta.json();
                traducoes.push(dados?.responseData?.translatedText || parte);
            }
            setDescricaoTraduzida(traducoes.join(' '));
        } catch (error) {
            console.log('Erro ao traduzir descrição:', error);
            setDescricaoTraduzida(texto);
        } finally {
            setTraduzindo(false);
        }
    }

    useEffect(() => {
        carregarDetalhes();
    }, [id]);

    function traduzirDieta(dieta: string) {
        const traducoes: any = {
            carnivore: 'Carnívoro',
            herbivore: 'Herbívoro',
            omnivore: 'Onívoro',
            piscivore: 'Piscívoro',
        };

        return (
            traducoes[dieta?.toLowerCase()] || dieta || 'Não informada'
        );
    }

    function traduzirLocomocao(locomocao: string) {
        const traducoes: any = {
            biped: 'Bípede',
            quadruped: 'Quadrúpede',
            swimming: 'Nadador',
            gliding: 'Planador',
            'facultative biped': 'Bípede facultativo',
        };

        return (
            traducoes[locomocao?.toLowerCase()] || locomocao || 'Não informada'
        );
    }

    function traduzirPeriodo(periodo: string) {
        if (!periodo) {
            return 'Não informado';
        }

        return periodo
            .replace(
                /Early Cretaceous/gi,
                'Cretáceo Inferior'
            )
            .replace(
                /Late Cretaceous/gi,
                'Cretáceo Superior'
            )
            .replace(
                /Middle Cretaceous/gi,
                'Cretáceo Médio'
            )
            .replace(
                /Early Jurassic/gi,
                'Jurássico Inferior'
            )
            .replace(
                /Middle Jurassic/gi,
                'Jurássico Médio'
            )
            .replace(
                /Late Jurassic/gi,
                'Jurássico Superior'
            )
            .replace(
                /Early Triassic/gi,
                'Triássico Inferior'
            )
            .replace(
                /Middle Triassic/gi,
                'Triássico Médio'
            )
            .replace(
                /Late Triassic/gi,
                'Triássico Superior'
            )
            .replace(
                /Paleocene/gi,
                'Paleoceno'
            )
            .replace(
                /Eocene/gi,
                'Eoceno'
            )
            .replace(
                /Oligocene/gi,
                'Oligoceno'
            )
            .replace(
                /Miocene/gi,
                'Mioceno'
            )
            .replace(
                /Pliocene/gi,
                'Plioceno'
            );
    }

    function pegarClassificacao(
        lista: any[],
        tipo: string,
        valorPadrao: string
    ) {
        if (!Array.isArray(lista)) {
            return valorPadrao;
        }

        const item = lista.find(
            (item) =>
                item?.familyType?.toLowerCase() ===
                tipo.toLowerCase() ||
                item?.genusType?.toLowerCase() ===
                tipo.toLowerCase() ||
                item?.speciesType?.toLowerCase() ===
                tipo.toLowerCase()
        );

        return item?.value || valorPadrao;
    }

    if (carregando) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator
                    size="large"
                    color="#67E88A"
                />

                <Text style={styles.carregandoTexto}>
                    Carregando informações...
                </Text>
            </View>
        );
    }

    if (erro && !dino) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.erroTexto}>
                    {erro}
                </Text>

                <TouchableOpacity
                    style={styles.botaoTentarNovamente}
                    onPress={carregarDetalhes}
                >
                    <Text style={styles.textoBotaoTentar}>
                        Tentar Novamente
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const familia = pegarClassificacao(
        dino?.classificationInfo?.familyInfo,
        'Family',
        'Não informada'
    );

    const genero = pegarClassificacao(
        dino?.classificationInfo?.genusInfo,
        'Genus',
        'Não informado'
    );

    const especie = pegarClassificacao(
        dino?.classificationInfo?.speciesInfo,
        'Species',
        'Não informada'
    );

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titulo}>{dino?.name || 'DINOSSAURO'}</Text>

            {imagem && (
                <View style={styles.imagemContainer}>
                    <Image
                        style={styles.imagem}
                        source={{
                            uri: imagem,
                            headers: {
                                "User-Agent": "DinoApp/1.0 (seuemail@dominio.com)",
                            },
                        }}
                        contentFit="contain"
                        transition={200}
                        onError={(error) => {
                            console.log('ERRO AO CARREGAR IMAGEM:', error
                            );
                        }}
                    />
                </View>
            )}

            <View style={styles.cardDescricao}>
                <Text style={styles.subtitulo}>
                    DESCRIÇÃO
                </Text>

                <View style={styles.linhaVerde} />

                {traduzindo ? (
                    <View style={styles.carregandoDescricao}>
                        <ActivityIndicator
                            size="small"
                            color="#67E88A"
                        />

                        <Text style={styles.textoTraduzindo}>
                            Traduzindo descrição...
                        </Text>
                    </View>
                ) : (
                    <Text style={styles.descricao}>
                        {descricaoTraduzida ||
                            dino?.description ||
                            'Sem descrição adicional.'}
                    </Text>
                )}
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.subtitulo}>
                    INFORMAÇÃO
                </Text>

                <View style={styles.linhaVerde} />

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        ERA
                    </Text>

                    <Text style={styles.valor}>
                        {traduzirPeriodo(
                            dino?.temporalRange
                        )}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        FAMÍLIA
                    </Text>

                    <Text style={styles.valor}>
                        {familia}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        GÊNERO
                    </Text>

                    <Text style={styles.valor}>
                        {genero}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        ESPÉCIE
                    </Text>

                    <Text style={styles.valor}>
                        {especie}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        ALTURA
                    </Text>

                    <Text style={styles.valor}>
                        {dino?.height || 'Não informada'}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        COMPRIMENTO
                    </Text>

                    <Text style={styles.valor}>
                        {dino?.length || 'Não informado'}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        PESO
                    </Text>

                    <Text style={styles.valor}>
                        {dino?.weight || 'Não informado'}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        DIETA
                    </Text>

                    <Text style={styles.valor}>
                        {traduzirDieta(dino?.diet)}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        LOCOMOÇÃO
                    </Text>

                    <Text style={styles.valor}>
                        {traduzirLocomocao(
                            dino?.locomotionType
                        )}
                    </Text>
                </View>

                <View style={styles.linha}>
                    <Text style={styles.rotulo}>
                        TAMANHO DO LOTE DE OVOS
                    </Text>

                    <Text style={styles.valor}>
                        {dino?.eggClutchSize || 'Não informado'}
                    </Text>
                </View>
            </View>

            <View style={styles.navegacao}>
                {id > 1 ? (
                    <TouchableOpacity
                        style={styles.botaoNavegacao}
                        onPress={() =>
                            navigation.navigate(
                                'Detalhes',
                                {
                                    id: id - 1,
                                }
                            )
                        }
                    >
                        <Text style={styles.seta}>
                            ‹
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.espacoBotao} />
                )}
                <Text style={styles.textoNavegacao}> DINOSSAURO {id}</Text>

                <TouchableOpacity
                    style={styles.botaoNavegacao}
                    onPress={() =>
                        navigation.navigate(
                            'Detalhes',
                            {
                                id: id + 1,
                            }
                        )
                    }
                >
                    <Text style={styles.seta}>
                        ›
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: '#0B3540',
    },

    container: {
        padding: 20,
        paddingBottom: 40,
    },

    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B3540',
        padding: 24,
    },

    carregandoTexto: {
        marginTop: 10,
        fontSize: 14,
        color: '#67E88A',
    },

    erroTexto: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },

    botaoTentarNovamente: {
        backgroundColor: '#67E88A',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },

    textoBotaoTentar: {
        color: '#082A34',
        fontSize: 15,
        fontWeight: 'bold',
    },

    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#F1F1F1',
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
    },

    imagemContainer: {
        width: '100%',
        height: 260,
        backgroundColor: '#082A34',
        borderRadius: 22,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    imagem: {
        width: '100%',
        height: '100%',
    },

    cardDescricao: {
        backgroundColor: '#082A34',
        padding: 20,
        borderRadius: 22,
        marginBottom: 20,
    },

    cardInfo: {
        backgroundColor: '#082A34',
        padding: 20,
        borderRadius: 22,
        marginBottom: 20,
    },

    subtitulo: {
        color: '#67E88A',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    linhaVerde: {
        height: 2,
        backgroundColor: '#67E88A',
        marginTop: 8,
        marginBottom: 5,
    },

    linha: {
        minHeight: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#31535A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    rotulo: {
        color: '#F1F1F1',
        fontSize: 14,
        flex: 1,
    },

    valor: {
        color: '#67E88A',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 1,
    },

    descricao: {
        color: '#F1F1F1',
        fontSize: 16,
        lineHeight: 27,
    },

    carregandoDescricao: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    textoTraduzindo: {
        color: '#67E88A',
        fontSize: 14,
        marginTop: 10,
    },

    navegacao: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
        marginBottom: 20,
    },

    botaoNavegacao: {
        width: 55,
        height: 55,
        backgroundColor: '#67E88A',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    seta: {
        color: '#082A34',
        fontSize: 42,
        lineHeight: 45,
        fontWeight: 'bold',
    },

    textoNavegacao: {
        color: '#67E88A',
        fontSize: 14,
        fontWeight: 'bold',
    },

    espacoBotao: {
        width: 55,
    },
});