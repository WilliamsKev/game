import React from 'react'
import { VscHome, VscLibrary, VscSettingsGear } from 'react-icons/vsc'

export const Header = () => {

    const menu = [
        {
            title: 'home',
            link: '/home',
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
            icon: <VscSettingsGear/>
        }
    ]
    return(
        <section className="header">
            <section className="menu">
            {
                menu.map((element) => (
                    <a key={element.title} href={element.link}>
                        <div className="menu-item" data-focus={window.location.pathname === element.link}>
                            {element.icon}
                        </div>
                    </a>
                ))
            }
            </section>
        </section>
    )
}