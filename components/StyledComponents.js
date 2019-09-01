import {
  space,
  height,
  width,
  fontSize,
  color,
  display,
  flex,
  flexWrap,
  flexDirection,
  flexBasis,
  alignSelf,
  justifySelf,
  alignItems,
  justifyContent,
  background,
  backgroundImage,
  backgroundSize,
  backgroundRepeat,
  borderRadius,
  borderColor,
  borders,
  boxShadow,
  opacity,
  overflow,
  position,
  zIndex,
  top,
  left,
  bottom,
  right,
  fontFamily,
  fontWeight,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  size,
  ratio
} from 'styled-system';
import styled from 'styled-components';

// background-image: linear-gradient(to right top, #191915, #2a2a21, #3d3c2d, #514f39, #676246);
// background-image: linear-gradient(to right top, #553312, #5f3812, #693d13, #734213, #7d4713);
// background-image: linear-gradient(to right top, #37210b, #472a0e, #593410, #6a3d12, #7d4713);
// background-image: linear-gradient(to right top, #543210, #653c13, #774617, #89501a, #9c5b1e);
// background-image: linear-gradient(to right top, #553312, #5f3812, #693d13, #734213, #7d4713);

export const Input = styled.input`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
  ${ratio}
`;

export const StandardInput = styled(Input)`
  font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
  background-color: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 3px;
  box-sizing: border-box;
  color: #152025;
  padding: 5px 10px;
  font-size: 13px;
  &:focus {
    outline: none;
  }
`;

export const Button = styled.button`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
  ${ratio}
`;

export const StandardButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 3px;
  border: none;
  min-width: ${props => (props.minWidth ? props.minWidth : '45px')};
  padding: ${props => (props.padding ? props.padding : '0px 15px')};
  height: 25px;
  margin: 5px 5px;
  background-color: ${props =>
    props.disabled ? '#d1d1d1' : props.backgroundColor ? props.backgroundColor : '#14aaf5'};
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: ${props =>
      props.disabled ? '#d1d1d1' : props.backgroundColor ? props.backgroundColor : '#1299dc'};
    opacity: ${props => (props.backgroundColor ? 0.4 : 1)};
  }
  &:active {
    background-color: ${props =>
      props.disabled ? '#d1d1d1' : props.backgroundColor ? props.backgroundColor : '#1088c4'};
    opacity: ${props => (props.backgroundColor ? 0.7 : 1)};
  }
`;

export const Label = styled.label`
  ${space}
  ${height}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${alignSelf}
  ${justifySelf}
  ${alignItems}
  ${justifyContent}
  ${flex}
  ${flexWrap}
  ${flexDirection}
  ${flexBasis}
  ${background}
  ${backgroundImage}
  ${backgroundSize}
  ${backgroundRepeat}
  ${borderRadius}
  ${borderColor}
  ${borders}
  ${boxShadow}
  ${opacity}
  ${overflow}
  ${position}
  ${zIndex}
  ${top}
  ${left}
  ${bottom}
  ${right}
  ${fontFamily}
  ${fontWeight}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${size}
  ${ratio}
`;

export const StandardLabel = styled(Label)`
  font-family: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "avenir next", avenir, "Segoe UI", Arial, sans-serif';
  color: ${props => (props.color ? props.color : '#808590')};
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 5px;
`;
