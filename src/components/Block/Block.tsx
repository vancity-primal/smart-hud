import styled from "@emotion/styled";

export const Block = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  color: ${(p) => p.color};
`;
