import React, { useRef } from "react";
import { Button, Text, TextInput, View, StyleSheet } from "react-native";

const ComponentWithRefAsProp = ({ ref }: { ref: any }) => {
  return <Button onPress={() => ref?.current?.focus()} title="Focus Input" />;
};

export const RefAsProps = () => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Testing: Ref as Prop in Function Components</Text>
      <Text style={styles.heading}>Result: On Press of "Focus Input" it should focus TextInput</Text>
      <TextInput ref={inputRef} placeholder="Type something..." style={styles.input} />
      <ComponentWithRefAsProp ref={inputRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});

