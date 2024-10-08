class GlobalState {
    static state = {isTransact:undefined};
    // state will be an object
    constructor(initialState) {
        this.state = initialState
    }
 
    static addGlobalState(newState) {
        this.state = { ...this.state, ...newState }
    }
 
    // static mutateGlobalState(key, newValue) {
    //     if (this.state.hasOwnProperty(key)) {
    //         // update the old value of this.globalState[key] with new value
    //         this.state[key] = newValue
    //     } else {
    //         throw new Error('Key does not exist.')
    //     }
    // }
 
    static printGlobalState() {
        console.log("\nGlobal State object is : ", this.state)
    }
}
 
module.exports = GlobalState;