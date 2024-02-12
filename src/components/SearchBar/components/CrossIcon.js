import React from 'react'
import styled from 'styled-components'

const CrossIconStyled = styled.a`
    width: 30px;
    height: 30px;
    opacity: 1;

    &:before, &:after {
        position: absolute;
    content: ' ';
        height: 30px;
        width: 1.5px;
        background-color: black;
    }
    &:before {
        transform: rotate(45deg);
    }
    &:after {
        transform: rotate(-45deg);
    }
`

const CrossIcon = () => {
    return (
        <CrossIconStyled href="#"/>
    )
}

export default CrossIcon
