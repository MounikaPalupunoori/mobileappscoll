import React, { useState } from "react";
import { View, Platform } from "react-native";
import styled from "styled-components";

const StyledInput = styled.TextInput`
  height: 50px;
  font-size: 18px;
  width: 100%;
  max-width: 450px;
  border-radius: 10px;
  background: #f5f5f5;
  padding-left: 10px;
`;
const StyledLabel = styled.Text`
  font-weight: 300;
  font-size: 12px;
  color: #444444;
  padding-bottom: 7px;
`;

function TextField({ label, icon, events, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View pointerEvents={events ? events : "auto"}>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        {...props}
        style={[
          props.style,
          isFocused && { borderWidth: 1, borderColor: "#1ba3a5" },
        ]}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      >
        {props.children}
      </StyledInput>
    </View>
  );
}

export default TextField;
