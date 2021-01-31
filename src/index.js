import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Button,
    Container,
    Input,
    Jumbotron,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import reportWebVitals from './reportWebVitals';

const QuoteButton = (props) => (
    <Button outline color={props.color} onClick={props.onClick}>
        {props.text}
    </Button>
);

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

const App = (props) => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState('Enter a Player Name here...');

    useEffect(() => {
        const getPlayers = async () => {
            try {
                const playersDB = await axios.get(
                    'http://localhost:8000/players'
                );

                const playersArray = [];

                for (let i in playersDB.data)
                    playersArray.push([i, playersDB.data[i]]);

                const FormattedArray = playersArray.map((x) => x[1]);

                const activePlayersArray = FormattedArray.filter(
                    (player) =>
                        player.search_rank <= 2000 &&
                        player.search_rank !== null &&
                        player.full_name
                            .toLowerCase()
                            .includes(search.toLocaleLowerCase())
                ).sort((a, b) => a.search_rank - b.search_rank);

                setPlayers(activePlayersArray);
            } catch (err) {
                console.error(err.message);
            }
        };
        getPlayers();
    }, [search]);

    return (
        <div>
            <Container>
                <Jumbotron className="mt-5">
                    <h1 className="display-3">Search NFL Players</h1>
                    <p className="lead">
                        This is a list of the 2000 most searched NFL
                        players on the Sleeper App
                    </p>
                    <hr className="my-2" />
                    <p>
                        Uses data from the Sleeper API (served locally) and
                        built with React
                    </p>
                    <Input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </Jumbotron>

                <ListGroup>
                    {players.map((player) => (
                        <ListGroupItem key={player.player_id}>
                            {player.search_rank} {player.full_name},{' '}
                            {player.team}{' '}
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Container>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
