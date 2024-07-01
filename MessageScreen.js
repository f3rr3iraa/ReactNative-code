import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import stylemessage from './stylemessage';

export const MessageScreen = ({ route }) => {
    const { contact } = route.params;
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState(contact.mensagem ? [contact.mensagem] : []);

    useEffect(() => {
        
        fetch('https://retoolapi.dev/R0sxOd/data')
            .then(response => response.json())
            .then(data => {
                
                const filteredMessages = data.filter(item => item.contactId === contact.id && item.message);
                
                setMessages(filteredMessages.map(item => item.message));
            })
            .catch(error => console.error('Erro ao obter mensagens:', error));
    }, [contact.id]);

    const handleMessageSend = () => {
        
        fetch('https://retoolapi.dev/R0sxOd/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: newMessage,
                contactId: contact.id
            }),
        })
        .then(response => {
            if (response.ok) {
                console.log('Mensagem enviada com sucesso para a API.');
                setMessages([...messages, newMessage]);
                setNewMessage('');
                alert('Mensagem enviada!');
            } else {
                console.error('Falha ao enviar mensagem para a API.');
                alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
            }
        })
        .catch(error => {
            console.error('Erro ao enviar mensagem para a API:', error);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        });
    };

    return (
        <ScrollView style={stylemessage.container}>
            <Text style={stylemessage.contactName}>
                Mensagem: {contact.nome} {contact.sobrenome}
            </Text>
            <TextInput 
                style={stylemessage.messageInput} 
                placeholder="Escreva uma mensagem..." 
                multiline
                value={newMessage}
                onChangeText={setNewMessage}
            />
            <Button title="Enviar" onPress={handleMessageSend} />
            
            <View>
                <Text style={stylemessage.texttitleNotif}>Mensagens</Text>
                {messages.map((message, index) => (
                    <View key={index} style={stylemessage.containerNotif}>
                        <Text style={stylemessage.textNotif}>{message}</Text>
                    </View>
                ))}
            </View>
            
            <View>
                <Text style={stylemessage.texttitleNotif}>Chamadas</Text>
                <View key={contact.id} style={stylemessage.containerNotif}>
                    <Text style={stylemessage.textNotif}>{contact.chamada}</Text>
                    <Text style={stylemessage.textDate}>{contact.date_chamada}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

export default MessageScreen;
