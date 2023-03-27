/** Board class */
export default class Board {
  constructor(status, boardLength) {
    this.status = status;
    this.boardLength = boardLength;
    this.boardSize = boardLength ** 2;
  }
}
