import { styled } from 'styled-components';

export const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.60);
  backdrop-filter: blur(2.5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledLoader = styled.img`
  width: 52px;
  height: auto;
`;
