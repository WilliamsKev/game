import React, { Component } from 'react'
import Draggable from 'react-draggable'
import { Header } from './Layout'
import { Card } from './Components'

import { VscRefresh } from 'react-icons/vsc'

import './App.scss'

class App extends Component{

    constructor(props) {
        super(props)
        this.state = {
            card: {
                size: {
                    x: 59, 
                    y: 91
                },
                margin: 10,
                scale: 1.5,
                space: {
                    x: 20,
                    y: 20
                },
                transition: {
                    time: .2,
                    type: 'ease'
                }
            },
            game: {
                points: 0,
                history: [],
                end: false,
                win: false
            },
            time: 0,
            ready: false,
            timer: null,
            table: null,
            cards: null,
            decks: null,
            followCards: []
        }
    }

    componentDidMount(){
        this.setTableDimensions()
        if(localStorage.getItem('state')){
            const state = JSON.parse(localStorage.getItem('state'))
            console.log(state)
            this.setState({
                game: state.game,
                cards: state.cards,
                time: state.time,
                decks: state.decks,
                ready: state.ready
            })
        }else{
            this.setState({
                cards: this.generateSuffleCards(),
                decks: this.generateNewDecks(this.state)
            }, () => {
                this.dealCards()
                setTimeout(() => {
                    this.setState({
                        ready: true
                    })
                }, 28 * 2 * 100)
            })
        }
    }

    componentDidUpdate(){
        if(this.state.ready) localStorage.setItem('state', JSON.stringify(this.state))
    }

    setFinalDecks = () => {
        let change = false
        this.state.decks.forEach((deck, index) => {
            if((index === 1 || index > 5) && deck.pile.length){
                const indexCard = deck.pile[deck.pile.length - 1]
                for(let i=2 ; i<6 ; i++){
                    if(this.checkSwitchCard(indexCard, i)){
                        change = true
                        this.switchCard(indexCard, i, false, true)
                        break
                    }
                }
            }
        })
        if(change){
            setTimeout(() => {
                this.setFinalDecks()
            }, 300)
        }
        
    }

    resetGame = () => {
        this.setState({
            game: {
                points: 0,
                history: [],
                end: false,
                win: false
            },
            time: 0,
            table: null,
            cards: null,
            decks: null,
            ready: false,
            followCards: []
        }, () => {
            this.handleTimer(true)
            this.setState({
                cards: this.generateSuffleCards(),
                decks: this.generateNewDecks(this.state)
            }, () => {
                this.dealCards()
                setTimeout(() => {
                    this.setState({
                        ready: true
                    })
                }, 28 * 2 * 100)
            })
        })
    }

    checkEndgame = () => {

    }

    setTableDimensions = () => {
        const x = (this.state.card.scale * this.state.card.size.x + 2 * this.state.card.margin) * 7
        const y = (this.state.card.scale * this.state.card.size.y + 2 * this.state.card.margin) * 2
        const left = .5 * (window.innerWidth - x)
        const top = 130
        this.setState({
            table: {x: x, y: y, left: left, top: top}
        })
    }

    generateSuffleCards = () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        const symbols = ['C', 'D', 'H', 'S']
        const cards = []
        values.forEach(value => {
            symbols.forEach(symbol => {
                cards.push({value: value, symbol: symbol, pile:0, show: false, drag: false, position: {x:0, y:0} })
            })
        })
        return cards.sort(() => Math.random() - 0.5);
    }

    generateNewDecks = ({card}) => {
        const decks = [
            {
                name: 'deck_hide',
                pile: Array.from({length: 52}, (v, k) => k).reverse(),
                position: {x: 0, y: 0}
            },
            {
                name: 'deck_show',
                pile: [],
                position: {x: card.scale*card.size.x + 2*card.margin, y: 0}
            },
        ]
        for(let i=0; i < 4; i++){
            decks.push({
                name: 'final',
                pile: [],
                position: {x: (3+i) * (card.scale*card.size.x + 2*card.margin), y:0}
            })
        }
        for(let i=0; i < 7; i++){
            decks.push({
                name:'temp',
                pile: [],
                position: {x: i * (card.scale*card.size.x + 2*card.margin), y: card.scale*card.size.y + 2*card.margin}
            })
        }
        return decks;
    }

    dealCards = () => {
        for(let i=51; i > 23; i--){
            setTimeout(() => {
                let flip = (i ===51 || i === 50 || i === 48 || i === 45 || i === 41 || i === 36 || i === 30)
                if(i > 50) this.switchCard(i, 6, flip, false)
                else if(i > 48) this.switchCard(i, 7, flip, false)
                else if(i > 45) this.switchCard(i, 8, flip, false)
                else if(i > 41) this.switchCard(i, 9, flip, false)
                else if(i > 36) this.switchCard(i, 10, flip, false)
                else if(i > 30) this.switchCard(i, 11, flip, false)
                else this.switchCard(i, 12, flip, false)
            }, i*100)
        }
    }

    handleTimer = (stop) => {
        if(stop){
            clearInterval(this.state.timer)
        }else{
            this.setState({
                timer: setInterval(() => {
                    this.setState({
                        time: this.state.time + 1
                    })
                }, 1000)
            })
        }
    }

    checkSwitchCard = (indexCard, newPile) => {
        var pile = this.state.decks[newPile].pile
        var card = this.state.cards[indexCard]
        var prevCard = this.state.cards[pile[pile.length - 1]]

        if(prevCard === undefined){
            if(newPile > 5){
                if(card.value !== 13) return false
            } 
            else if(card.value !== 1) return false
        }else{
            if(newPile > 5){
                if(card.value + 1 !== prevCard.value) return false
                if((card.symbol === 'C' || card.symbol === 'S') && (prevCard.symbol === 'C' || prevCard.symbol === 'S')) return false
                if((card.symbol === 'D' || card.symbol === 'H') && (prevCard.symbol === 'D' || prevCard.symbol === 'H')) return false
            }
            else if(card.value !== prevCard.value + 1 || card.symbol !== prevCard.symbol || this.state.followCards.length > 0) return false
        }
        return true

    }

    switchCard = (indexCard, newPile, flip, history) => {

        //console.log('SWITCH CARD', indexCard, newPile, flip, history)

        var cards = this.state.cards
        var decks = this.state.decks
        var game = this.state.game
        var oldPile = cards[indexCard].pile
        var indexOldPile = decks[oldPile].pile.indexOf(indexCard)

        if(oldPile !== newPile){

            if(history) this.handleHistory(cards, decks, game, indexCard, oldPile, newPile, indexOldPile)

            decks[oldPile].pile.splice(indexOldPile, 1)
            decks[newPile].pile.push(indexCard)
            cards[indexCard].pile = newPile

            if(oldPile > 5){
                let pileLength = decks[oldPile].pile.length
                if(pileLength){
                    let previousIndex = decks[oldPile].pile[pileLength - 1]
                    cards[previousIndex].show = true;
                }
            }
        }

        let marginTop = (newPile > 5) ? this.state.card.space.y * decks[newPile].pile.indexOf(indexCard) : 0
        cards[indexCard].position.y = decks[newPile].position.y + marginTop
        cards[indexCard].position.x = decks[newPile].position.x
        if(newPile === 1 || oldPile === 1) this.handlePileVisible()

        if(flip) cards[indexCard].show = !cards[indexCard].show
        this.setState({
            cards: cards,
            decks: decks
        })
    }

    handleHistory = (cards, decks, game, indexCard, oldPile, newPile, indexOldPile) => {
        
        if(!this.state.game.history.length || !this.state.timer) this.handleTimer(false)

        let points = 0
        let indexPrevCard = decks[oldPile].pile[indexOldPile - 1]
        if(indexPrevCard !== undefined){
            //console.log(indexPrevCard, cards[indexPrevCard].show)
        }

        if(((oldPile > 5 && (indexPrevCard === undefined || !cards[indexPrevCard].show)) || (oldPile === 1 && newPile !== 0)) && !this.state.followCards.includes(indexCard)){
            if(oldPile === 1 && newPile < 6) points = 10
            else points = 5
        }
        game.points += points

        game.history.push({time: this.state.time, indexCard: indexCard, oldPile: oldPile, points: points})

        this.setState({
            game: game    
        })
    }

    historyCancel = () => {
        
    }

    handleClickCard = (index) => {
        const indexDeck = this.state.cards[index].pile
        var pile = this.state.decks[indexDeck].pile
        if(indexDeck > 0) return false
        for(let i = 0; i < Math.min(3, pile.length); i++){
            setTimeout(() => {
                this.switchCard(pile[pile.length - 1], 1, true, true)
            }, i*100)
        }
    }

    handlePileVisible = () => {
        var cards = this.state.cards
        this.state.decks[1].pile.forEach(indexCard => {
            let length = (this.state.decks[1].pile.length > 3) ? 3 : this.state.decks[1].pile.length
            let space = (this.state.decks[1].pile.indexOf(indexCard) + length - this.state.decks[1].pile.length)
            space = Math.max(0, space)
            cards[indexCard].position.x = this.state.decks[1].position.x + this.state.card.space.x * space
        })
        this.setState({
            cards: cards
        })
    }

    handleDragStart = (index) => {

        let indexDeck = this.state.cards[index].pile
        let pile = this.state.decks[indexDeck].pile
        if(indexDeck === 0 || (indexDeck < 6 && pile[pile.length - 1] !== index) || !this.state.cards[index].show) return false
        this.setCardFollow(index)
        this.setCardDrag(index, 0)
    }

    handleDrag = (index, event, info) => {
        let cards = this.state.cards
        this.state.followCards.forEach((indexCard, index) => {
            cards[indexCard].position.x = info.x
            cards[indexCard].position.y = info.y + (index + 1) * this.state.card.space.y
        })
        this.setState({
            cards: cards
        })
    }

    handleDragEnd = (index, event, info) => {
        var newDeck = -1;
        this.state.decks.forEach((deck, indexDeck) => {
            let cardSizeX = this.state.card.size.x * this.state.card.scale
            let cardSizeY = (indexDeck < 6) ? this.state.card.size.y * this.state.card.scale : (this.state.card.size.y * this.state.card.scale) + (this.state.card.space.y * deck.pile.length)
            if(indexDeck > 1 && deck.position.x < event.layerX && deck.position.x + cardSizeX > event.layerX && deck.position.y < event.layerY && deck.position.y + cardSizeY > event.layerY){
                if(this.checkSwitchCard(index, indexDeck)){
                    newDeck = indexDeck
                }
            }
        })
        var indexDeck = (newDeck < 0) ? this.state.cards[index].pile : newDeck

       
        this.switchCard(index, indexDeck, false, !(newDeck < 0))
        this.setCardDrag(index, -1)
        this.state.followCards.forEach(indexCard => {
            this.switchCard(indexCard, indexDeck, false, !(newDeck < 0))
            this.setCardDrag(indexCard, -1)
        })
        this.setCardFollow(-1)
    }

    setCardFollow = (index) => {
        if(index < 0){ 
            this.setState({
                followCards: []
            })
            return false
        }

        let card = this.state.cards[index]
        let deck = this.state.decks[card.pile]

        var followCards = []

        let i = 1;
        while(deck.pile.indexOf(index) !== deck.pile.length - 1){
            index = deck.pile[deck.pile.indexOf(index) + 1]
            followCards.push(index)
            this.setCardDrag(index, i++)
        }
        this.setState({
            followCards: followCards
        })
    }

    setCardDrag = (indexCard, zIndex) => {
        var cards = this.state.cards
        if(zIndex < 0) cards[indexCard].drag = 0
        else cards[indexCard].drag = 1000 + zIndex
        this.setState({
            cards:cards
        })
    }

    switchDeck = (indexEmplacement) => {
        if(this.state.decks && indexEmplacement === 0){
            if(this.state.decks[0].pile.length === 0){
                this.state.decks[1].pile.reverse().forEach(indexCard => {
                    setTimeout(() => {
                        this.switchCard(indexCard, 0, true, true)
                    }, 20)
                })
            }
        }
    }

    render(){
        return(
            <React.Fragment>
                <Header time={this.state.time} points={this.state.game.points} handleHistory={this.historyCancel} handleReset={this.resetGame}/>
                <section className="table" 
                    style={{
                        width: `${7 * (this.state.card.size.x * this.state.card.scale + 2 * this.state.card.margin)}px`
                    }}
                    onDoubleClick={this.setFinalDecks}>
                    <section className="container-decks">
                        {
                            this.state.decks && this.state.decks.map((deck, index) => (
                                <div key={`${index}`} className="deck" id={index} onClick={() => this.switchDeck(index)}
                                style={{
                                    margin: `${this.state.card.margin}px`,
                                    width: `${this.state.card.scale*this.state.card.size.x}px`,
                                    height: `${this.state.card.scale*this.state.card.size.y}px`,
                                    transform: `translate(${deck.position.x}px, ${deck.position.y}px)`
                                }}>
                                {
                                    index === 0 && 
                                    <div className="deck-refresh">
                                        <VscRefresh/>
                                    </div>
                                }    
                                </div>
                            ))
                        }
                    </section>
                    <section className="container-cards">
                        {
                            this.state.cards && this.state.cards.map((card, index) => {
                                return(
                                    <Draggable key={`card-${index}`} position={card.position}
                                        onStart={() => this.handleDragStart(index)} 
                                        onDrag={(event, info) => this.handleDrag(index, event, info)} 
                                        onStop={(event, info) => this.handleDragEnd(index, event, info)}>
                                        <div className="wrapper-card" data-pile={card.pile} data-id={index}
                                            style={{
                                                zIndex:`${card.drag ? card.drag : 10*this.state.decks[card.pile].pile.indexOf(index)}`,
                                                margin: `${this.state.card.margin}px`,
                                                transition: `${(card.drag) ? `none` : `transform ${this.state.card.transition.time}s ${this.state.card.transition.type} 0s`}`
                                            }}>
                                            <Card 
                                                style={{
                                                    width:`${this.state.card.size.x*this.state.card.scale}px`,
                                                    height:`${this.state.card.size.y*this.state.card.scale}px`,
                                                    boxShadow:`${(card.pile > 5 || 
                                                        (card.pile === 1 && this.state.decks[card.pile].pile.indexOf(index) > this.state.decks[card.pile].pile.length - 4) ||
                                                        (card.pile === 0 && this.state.decks[card.pile].pile.indexOf(index) < 1)
                                                    ) ? `0 0 4px 0 rgba(0, 0, 0, .6)` : ``}`,
                                                    cursor: `${card.drag ? `grabbing` : 
                                                        (card.pile === 1 && this.state.decks[card.pile].pile.indexOf(index) === this.state.decks[card.pile].pile.length - 1) ? `grab` : 
                                                        (card.pile > 1 && card.show) ? `grab` : 
                                                        (card.pile === 0) ? `pointer` : `default`}`
                                                }}
                                                index={index} value={card.value} symbol={card.symbol} show={card.show} handleClick={this.handleClickCard}/>
                                        </div>
                                    </Draggable>
                                )
                            })
                        }
                    </section>
                </section>
            </React.Fragment>
        )
    }
}

export default App