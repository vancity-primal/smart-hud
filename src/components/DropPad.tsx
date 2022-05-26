import styled from "@emotion/styled";
import React from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 2px;
  width: 700px;
  height: 85px;
  background-color: gray;
  margin: 15px auto;
  p {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    margin-top: 35px;
  }
`;

export const DropPad: React.FC<Partial<DropzoneOptions>> = (props) => {
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone(props);

  return (
    <Container {...getRootProps({ isDragActive, isDragAccept, isDragReject })}>
      <input {...getInputProps()} />
      <p>Drag replay file here or click to select</p>
    </Container>
  );
};
