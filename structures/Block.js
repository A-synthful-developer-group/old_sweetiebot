module.exports = class Block {
    constructor(options = {}) {
        this.magicn = options.magicn;
        this.header = options.header;
        /*
        {
            version: 1,
            hashPrevBlock: 256-bit hash of the previous block header,
            hashMerkleRoot: 256-bit hash based on all of the transactions in the block,
            time: timestamp when this is done,
            bits: current target in compact format,
            nonce: 32-bit number (starts at 0)
        }
        bad ideas about doing are the nonce and the hashPrevBlock, they are the main ideas of how things should be done but it would waste a lot of processing if i try simulating it
        so this will probably be done in a special way
        */
        this.transactionCounter = options.transactionCounter;
        this.transactions = options.transactions;
        const size = JSON.stringify(options).length;
        if(size > 1000008)
            return 2;
    }


};