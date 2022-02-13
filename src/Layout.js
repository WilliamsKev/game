import React, { useState } from 'react'
import { BsClock, BsClipboardData, BsArrowLeftShort, BsArrowCounterclockwise } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'

export const Header = ({ time, points, handleHistory, handleReset }) => {

    const [ showModal, setShowModal ] = useState(false)

    return(
        <React.Fragment>
            <section className="header">
                <section className="menu">
                    <div className="menu-item" data-type="button">
                        <i><BsArrowLeftShort/></i>
                    </div>
                    <section>
                        <div className="menu-item" data-type="value">
                            <i><BsClock/></i>
                            <span>{Math.floor(time/60)}:{(time % 60).toString().length < 2 ? `0${time % 60}` : `${time % 60}`}</span>
                        </div>
                        <div className="menu-item" data-type="value">
                            <i><BsClipboardData/></i>
                            <span>{points}</span>
                        </div>
                    </section>
                    <div className="menu-item" data-type="button" onClick={() => setShowModal(true)}>
                        <i><BsArrowCounterclockwise/></i>
                    </div>
                </section>
            </section>
            <Modal 
                show={showModal}
                img="emoji/astonished.png" 
                content="Are you sure you want to restart the game ?" 
                button="No" 
                submit="Yes, restart"
                styles={{
                    top: '100px',
                    right: '20px'
                }}
                handleSubmit={handleReset}
                handleShow={setShowModal} />
        </React.Fragment>
    )
}

export const Modal = ({show, img, content, button, submit, styles, handleSubmit, handleShow}) => {

    const setShow = (event) => {
        if(event.target.dataset.type === "close") handleShow(false)
    }

    return(
        <section className="modal-wrapper" data-show={show} data-type="close" onClick={event => setShow(event)}>
            <section className="modal" style={styles} data-show={show}>
                <section className="modal-header">
                    <div className="modal-emoji">
                        <img src={`${process.env.PUBLIC_URL}/assets/${img}`}/>
                    </div>
                </section>
                <section className="modal-content">
                    <p>{content}</p>
                </section>
                <section className="modal-footer">
                    <button data-type="close" onClick={event => setShow(event)}>{button}</button>
                    <button data-type="submit" onClick={() => {
                        handleShow(false)
                        handleSubmit()
                    }}>{submit}</button>
                </section>
            </section>
        </section>
    )
}