import React, { Component } from 'react';
import axios from 'axios';
import Card from './Card';
import './Deck.css';

const CARD_API_BASE = "https://deckofcardsapi.com/api/deck";
// new/shuffle/?deck_count=1


export default class Deck extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deck: null,
            cards: []
        }
        this.getCard = this.getCard.bind(this);
    }

    async componentDidMount() {
        let deck = await axios.get(`${CARD_API_BASE}/new/shuffle/`);
        this.setState({ deck: deck.data });
    }

    async getCard() {
        const id = this.state.deck.deck_id;
        
        // try getting new data after card draw and change state
        try {
            let newDeckRes = await axios.get(`${CARD_API_BASE}/${id}/draw/`);
            
            // check for 52 cards drawn
            if (!newDeckRes.data.success) {
                throw new Error("No cards remaining!");
            }

            // get new card data and add to state
            let newCard = newDeckRes.data.cards[0];
            this.setState(st => ({
                cards: [
                    ...st.cards, 
                    {
                        id: newCard.code,
                        image: newCard.image,
                        name: `${newCard.value} of ${newCard.suit}`
                    }
                ]
            }));
        }
        catch (err) {
            alert(err);
        }
    }

    render() {
        const card = this.state.cards.map(card => (
            <Card key={ card.id } name={ card.name } image={ card.image }/>
        ));

        return (
            <div className="Deck">
                <h2>Card Dealer</h2>
                <button onClick={ this.getCard }>Gimme a Card!</button>
                <div className="Deck-cardArea">
                    { card }
                </div>
            </div>
        )
    }
}