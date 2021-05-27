import React from 'react'
import Draggable from 'react-draggable'
import { NavLink } from 'react-router-dom'
import { VscHome, VscLibrary, VscChromeRestore } from 'react-icons/vsc'
import { BsClock, BsClipboardData } from 'react-icons/bs'

export const Header = () => {

    const menu = [
        {
            title: 'home',
            link: '/',
            icon: <VscHome/>
        },
        {
            title: 'solitaire',
            link: '/solitaire',
            icon: <VscLibrary/>
        },
        {
            title: '2048',
            link: '/2048',
            icon: <VscChromeRestore/>
        }
    ]
    return(
        <section className="header">
            <section className="menu">
            {
                menu.map((element) => (
                    <NavLink to={element.link} key={element.title}>
                        <div className="menu-item" data-focus={window.location.pathname === element.link}>
                            {element.icon}
                        </div>
                    </NavLink>
                ))
            }
            </section>
        </section>
    )
}

export const Toolbar = ({time, points}) => {
    return(
        <Draggable>
            <div className="toolbar-container">
                <div className="toolbar-open">
                    <BsClock/>
                    <span>{Math.floor(time/60)}:{(time % 60).toString().length < 2 ? `0${time % 60}` : `${time % 60}`}</span>
                </div>
                <div className="toolbar-open">
                    <BsClipboardData/>
                    <span>{points}</span>
                </div>
            </div>
        </Draggable>
    )
}