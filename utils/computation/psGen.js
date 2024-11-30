
const uuid = require("node-uuid");
const bycrpt = require("bcryptjs");

const psGenerator = {
    createPsNo: () => {
        var generatedPsNumber = uuid.v4().substring(0, 8),
        store = [],
        psIdChoice_1 = generatedPsNumber.slice(0, 3),
        psIdChoice_2 = generatedPsNumber.slice(5, 8);

        store.push(psIdChoice_1, psIdChoice_2);
        let choosePsNo = store[(Math.floor(Math.random() * store.length))]; // selecting the id of the psNo
        if (store.indexOf(choosePsNo) === 0) {
            return {index: 0, psId: psIdChoice_1, psNo: generatedPsNumber.slice(3, 8), toHash: generatedPsNumber};

        } else if (store.indexOf(choosePsNo) === 1) {
            return {index: 1, psId: psIdChoice_2, psNo: generatedPsNumber.slice(0, 5), toHash: generatedPsNumber};
        }
    },

    psNumber: async () => {

        // calling the method that will generates the psno
       const generatedPsNo = psGenerator.createPsNo();

       // Algo number of ps
       const Algo = "A3I1";

        if (generatedPsNo.index === 0) {
            // Creating a hand-copy of psNumber that will send to user
            let userPsNo = `${generatedPsNo.psId}-${generatedPsNo.psNo}`;
            let toHash = generatedPsNo.psId + Algo + generatedPsNo.psNo;
            
            // Hashing the psNo
            let hashed = await bycrpt.hash(toHash, 12);
            let compare = await bycrpt.compare(toHash, hashed)

            return {psId: generatedPsNo.psId, hashedPsNo: hashed, userPsNo: userPsNo};
            
        } else if (generatedPsNo.index === 1) {
            // Creating a hand-copy of psNumber that will send to user
            let userPsNo = `${generatedPsNo.psNo}-${generatedPsNo.psId}`;
            let toHash = generatedPsNo.psNo + Algo + generatedPsNo.psId;

            // Hashing the psNo
            let hashed = await bycrpt.hash(toHash, 12);
            await bycrpt.compare(toHash, hashed)
            
            return {psId: generatedPsNo.psId, hashedPsNo: hashed, userPsNo: userPsNo};

        }

    }

}

const comparePsNo = async (receivedPsNo, retrievedPsNo) => {
    const isMatch = await bycrpt.compare(receivedPsNo, retrievedPsNo);
    return isMatch;
}

module.exports = {
    psGenerator,
    comparePsNo
}
