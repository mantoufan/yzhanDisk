const store = {
  LOCALSTORAGE: 0,
  SESSIONSTORAGE: 1,
  MEMORY: 2,
  _engine: [localStorage, sessionStorage, Object.create(null)],
  _engineIndex: 0,
  set engine (index) {
    this._engineIndex = index
  },
  get engine () {
    return this._engine[this._engineIndex]
  },
  set (key, value, maxAge) {
    return this.engine[key] = JSON.stringify({
      value,
      expire: Date.now() + maxAge
    })
  },
  get (key) {
    const str = this.engine[key]
    if (str === void 0 || str === null) return null
    const { value, expire } = JSON.parse(str)
    if (Date.now() > expire) {
      delete this.engine[key]
      return null
    }
    return value
  },
  remove (key) {
    delete this.engine[key]
  }
}
export default store