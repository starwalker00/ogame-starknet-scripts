var { Contract } = require('starknet');
var { bnToUint256 } = require('starknet/dist/utils/uint256');
var { toBN } = require('starknet/dist/utils/number');

var ogameAbi = require('./abi/ogame.json');
var erc721Abi = require('./abi/erc721.json');
const ogameAddress = "0x03763a8330144f3552ba10e36fcf52fb002a338ff55ecb842d5282e0a6fb1226";

exports.fetchLeaderboard = async function () {
    console.log('fetchLeaderboard');
    console.log('Fetching...');

    // init ogame contract
    const ogame = new Contract(ogameAbi, ogameAddress);

    // get planet erc721 address
    const planetAddress = await ogame.erc721_address();
    const planetAddressBN = toBN(planetAddress[0]);
    const planetAddressHexString = "0x".concat(planetAddressBN.toString(16));
    // console.log(planetAddressHexString);

    // get planet erc721 total supply
    const planetTotalSupply = await ogame.number_of_planets();
    const planetTotalSupplyBN = toBN(planetTotalSupply[0]);
    console.log(`found ${planetTotalSupplyBN.toString(10)} entries`)

    // init planet contract
    const erc721 = new Contract(erc721Abi, planetAddressHexString);

    // get players and points, write or update results to file
    let leaders = [];
    for (let i = 1; i <= planetTotalSupplyBN.toNumber(); i++) {
        const ownerAddress = await erc721.ownerOf(bnToUint256(i));
        const ownerAddressBN = toBN(ownerAddress[0]);
        const ownerAddressHexString = "0x".concat(ownerAddressBN.toString(16));
        const points = await ogame.player_points(ownerAddressBN);
        const pointsBN = toBN(points);
        let leader = {
            owner: ownerAddressHexString,
            points: pointsBN.toString()
        }
        leaders.push(leader);
    }
    let now = new Date();
    let leaderboard = {
        updatedAt: now.toISOString(),
        leaders: leaders
    };
    console.log('Fetching done.');
    return leaderboard;
}