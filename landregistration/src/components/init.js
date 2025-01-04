import Web3 from "web3";

const init = async () => {
  const web3 = new Web3("http://localhost:7545");
  const contract = new web3.eth.Contract(/* ABI */ /* Contract Address */);
  return contract;
};

export default init;