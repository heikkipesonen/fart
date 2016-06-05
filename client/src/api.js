// import env from '../../env';

class Api {

  constructor () {
    this.viewModel = {
      scale: 1
    }

    /**
     * global event listeners
     * @type {Object}
     */
    this._listeners = {}

    document.addEventListener('mouseup', (event) => {
      this._fire('mouseup', event)
    })

    document.addEventListener('mousemove', (event) => {
      this._fire('mousemove', event)
    })
  }

  /**
   * subscribe to event
   * @param  {string}   event    event name
   * @param  {Function} callback a callback function
   * @param  {object}   context  callback context
   */
  on (event, callback, context) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }

    this._listeners[event].push({
      callback,
      context
    })
  }

  /**
   * remove registered callback object from event emitter
   * identifies callbacks by contexts
   * @param  {string} event   event name
   * @param  {object} context
   */
  remove (event, context) {
    if (this._listeners[event]) {
      let removables = this._listeners[event].filter((listener) => listener.context === context)
      removables.forEach((item) => {
        this._listeners[event].splice(this._listeners[event].indexOf(item), 1)
      })
    }
  }

  /**
   * private
   * trigger an event
   * fire all subscribed event listeners when an event occurs
   * @param  {string} event event name
   * @param  {object} data  event data
   */
  _fire (event, data) {
    if (this._listeners[event]) {
      this._listeners[event].forEach((listener) => {
        listener.callback.call(listener.context, data)
      })
    }
  }

  get scale () {
    return this.viewModel.scale
  }

  set scale (scale) {
    this.viewModel.scale = scale
  }
}

export default new Api()
