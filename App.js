import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import SendSMS from 'react-native-sms';

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://mocki.io/v1/a7ece137-81f0-463e-bd0e-81562935cbbc');
        setMessages(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    fetchData();
  }, []);

  const sendSMS = (phoneNumber, message) => {
    SendSMS.send({
      body: message,
      recipients: [phoneNumber],
      successTypes: ['sent', 'queued']
    }, (completed, cancelled, error) => {
      if (completed) {
        console.log('SMS enviado com sucesso.');
      } else if (cancelled) {
        console.log('Envio de SMS cancelado.');
      } else if (error) {
        console.log('Erro ao enviar SMS:', error);
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.numero_telefone}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.text}>Número: {item.numero_telefone}</Text>
            <Text style={styles.text}>Mensagem: {item.mensagem}</Text>
            <Button title="Enviar Mensagem" onPress={() => sendSMS(item.numero_telefone, item.mensagem)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    },
});

export default App;
