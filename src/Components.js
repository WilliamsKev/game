import React from 'react'

export const Card = ({style, index, value, symbol, show, handleClick}) => {

    const valueTable = ['#', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

    return(
        <div style={style} className='card' data-show={show} onClick={() => handleClick(index)}>
            <div className="card-back"></div>
            <div className="card-front" style={{backgroundImage:`url(${process.env.PUBLIC_URL}/assets/cards/${valueTable[value]}${symbol}.png`}}></div>
        </div>
    )
}