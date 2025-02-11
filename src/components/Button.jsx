import React from "react";
import styled from "styled-components/native";
import { Text } from "react-native";

const StyledButton = styled.TouchableOpacity`
  align-items: center;
  padding: 5px;
  justify-content: center;
  height: 40px;
  background-color: #3c8dbc;
  border-radius: 10px;
  max-width: 300px;
`;

export default function Button(props) {
  return (
    <StyledButton onPress={props.onPress} disabled={props.disable} {...props}>
      <Text style={{ color: "white", fontSize: 18 }}>{props.children}</Text>
    </StyledButton>
  );
}
