const OrderBook = require('./OrderBook');

/**
 * Store for multi-symbol orderbooks, grouped into one book (OrderBook) per symbol
 * @class OrderBooksStore
 */
class OrderBooksStore {
  /**
   * @param {boolean} traceLog - whether to console log when a snapshot or delta is processed
   */
  constructor({ traceLog, checkTimestamps, maxDepth }) {
    this.books = {};
    this.traceLog = traceLog;
    this.shouldCheckTimestamp = checkTimestamps;
    this.maxDepth = maxDepth;
  }

  /**
   * @param {string} symbol
   * @returns {OrderBook} created for symbol if not already tracked
   */
  getBook(symbol) {
    if (this.books[symbol]) {
      return this.books[symbol];
    }

    return this.books[symbol] = new OrderBook(symbol, { checkTimestamps: this.shouldCheckTimestamp, maxDepth: this.maxDepth });
  }

  /**
   * @public Store/replace existing orderbook state in-memory
   *
   * @param {string} symbol
   * @param {Array} current orderbook snapshot represented as array, where each child element is a level in the orderbook
   * @param {number} timestamp
   * @returns {OrderBook} that handled this event
   */
  handleSnapshot(symbol, data, timestamp) {
    return this.getBook(symbol).handleSnapshot(data, timestamp);
  }

  /**
   * @public Update existing orderbook state in-memory
   *
   * @param {string} symbol
   * @param {Array} deleteLevels - array with levels to delete
   * @param {Array} updateLevels - array with levels to update
   * @param {Array} insertLevels - array with levels to insert
   * @param {number} timestamp
   * @returns {OrderBook} that handled this event
   */
  handleDelta(symbol, deleteLevels, updateLevels, insertLevels, timestamp) {
    return this.getBook(symbol).handleDelta(
      deleteLevels,
      updateLevels,
      insertLevels,
      timestamp
    );
  }
}

module.exports = OrderBooksStore;