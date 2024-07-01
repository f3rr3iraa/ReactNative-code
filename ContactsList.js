import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Axios from 'axios';
import style from './style';

export const ContactsList = ({ navigation }) => { 
    const [contacts, setContacts] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    function ContactCart({ item }) {
        return (
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen', { contact: item })}>
                <View style={style.containerContact}>
                    <View style={style.containerItems}>
                        <View style={style.containerName}>
                            <Text style={style.text}>
                                {`${item.nome} ${item.sobrenome}`}
                            </Text>
                        </View>
                        <View style={style.containerInfo}>
                            <Text style={style.text}>
                                {`${item.codigo_empresa}, ${item.localizacao}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    useEffect(() => {1
        Axios.get('https://retoolapi.dev/R0sxOd/data').then(({ data }) => {
            setContacts(data);
        });
    }, []);

    const filteredContacts = contacts?.filter(contact => 
        `${contact.nome} ${contact.sobrenome}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            {!contacts ? (
                <View style={style.containerActivity}>
                    <ActivityIndicator size='large' />
                </View>
            ) : (
                <View style={style.container}>
                    <TextInput 
                        style={style.messageInput} 
                        placeholder="Introduza o nome"
                        value={searchQuery}
                        onChangeText={text => setSearchQuery(text)}
                    />
                    <FlatList
                        data={filteredContacts}
                        keyExtractor={(__, index) => index.toString()}
                        renderItem={ContactCart}
                    />
                </View>
            )}
        </>
    );
}
