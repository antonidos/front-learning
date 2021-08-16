import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { Interface } from 'readline';
import './index.css';

interface SquareProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  value: string,
}

interface BoardProps {
  squares: Array<string>,
  onClick: (i: number) => void,
}

interface GameState {
  state?: {
    squares: [],
    history: any[],
    xIsNext: boolean,
    stepNumber: number,
  }
   
}

function Square(props:SquareProps) {
      return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component<BoardProps>{
    renderSquare(i:number) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component<GameState> {
    constructor(props: any) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null)
        }],
        stepNumber : 0,
        xIsNext: true
      };

      this.handleClick = this.handleClick.bind(this);
    }

  
    handleClick(i:number) {
      const history = this.props.state!.history.slice(0, this.props.state!.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.props.state!.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.props.state!.xIsNext,
      });
    }

    jumpTo(step:any) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
    
    render() {
      const history = this.props.state!.history;
      const current = history[this.props.state!.stepNumber];
      const winner = calculateWinner(current.squares);

      const moves = history.map((step:any, move:any) => {
          const desc = move ? 
            'Перейти к ходу ' + move :
            'К началу игры';
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button> 
            </li>  
          )
      }); 

      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.props.state!.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i:number) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById('root'))
  
  function calculateWinner(squares:Array<string>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  