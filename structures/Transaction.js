module.exports = class Transaction {
    constructor(options = {}) {
        this.version = options.version;
        this.inCounter = options.inCounter;
        this.listOfInputs = options.listOfInputs;
        this.outCounter = options.outCounter;
        this.listOfOutputs = options.listOfOutputs;
        this.lockTime = options.lockTime || 0;
    }

    verify(listOfTransactions) {
        if(this.inCounter !== this.listOfInputs.size) return 1;
        if(this.outCounter !== this.listOfOutputs.size) return 2;
        if(this.version > 1 || this.version < 1) return 3;
        for(const [hash, data] of this.listOfInputs) {
            const prevTx = listOfTransactions.get(hash);
            if(!prevTx) return 4;
            const prevOutputData = prevTx.listOfOutputs[data.prevOutputIndex];
            if(!prevOutputData) return 5;
        }
        return 0;
    }
};