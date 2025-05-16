import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://your-node-server/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      navigation.navigate("Colorize");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Login failed");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Forgot Password?" onPress={() => navigation.navigate("ForgotPassword")} />
      <Button title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}