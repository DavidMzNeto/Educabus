import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

function HomeScreen() {
  const [code, setCode] = useState("123456");
  const [phoneNumber, setPhoneNumber] = useState(""); // Número de telefone do usuário

  const generateCode = async () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um novo código aleatório
    setCode(newCode);

    try {
      // Faz a requisição para o backend enviar o SMS
      const response = await fetch("http://10.0.2.2:3000/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: newCode,
          phoneNumber: phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sucesso", "SMS enviado com sucesso!");
      } else {
        Alert.alert("Erro", data.message || "Falha ao enviar SMS.");
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.circle}>
          <Text style={styles.circleText}>3</Text>
        </View>
        <TouchableOpacity style={styles.nameButton}>
          <Text style={styles.nameButtonText}>Nome</Text>
        </TouchableOpacity>
        <Ionicons name="person-outline" size={24} color="#000" />
      </View>
      <Text style={styles.title}>Digite o número do telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: +5511999999999"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <Text style={styles.title}>Aqui está seu código</Text>
      <TextInput style={styles.codeInput} value={code} editable={false} />
      <TouchableOpacity style={styles.generateButton} onPress={generateCode}>
        <Text style={styles.generateButtonText}>Gerar Código</Text>
      </TouchableOpacity>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Explore") {
              iconName = "location-outline";
            } else if (route.name === "Notificações") {
              iconName = "notifications-outline";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "red",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Explore" component={HomeScreen} />
        <Tab.Screen name="Notificações" component={NotificationsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
  },
  nameButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  nameButtonText: {
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  codeInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 18,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: "#f88",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
