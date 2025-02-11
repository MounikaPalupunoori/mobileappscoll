import React from "react";
import styled from "styled-components/native";

const StyledText = styled.Text`
  color: "#000000";
  font-family: "Regular";
  font-size: 18px;
  margin-vertical: 3px;
`;

export default function SmallText(props) {
  return <StyledText {...props}>{props.children}</StyledText>;
}
