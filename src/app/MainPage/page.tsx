// "use client";
// import React, { useEffect, useState } from "react";
// import { useAccount, useDeployContract } from "wagmi";
// import wagmiAbi from "../abii.json";

// const MainPage = () => {
//   const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
//   const { address } = useAccount();
//   const { data: hash, error, isPending, deployContract } = useDeployContract();

//   useEffect(() => {
//     if (address) {
//       setAccount(address);
//     }
//   }, [address]);

//   return (
//     <div>
//       {account ? account : "No account connected"}
//       <div>
//         <button
//           onClick={() =>
//             deployContract({
//               abi: wagmiAbi,
//               args: ["ss", "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5", "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5"],
//               bytecode:
//                 "0x...",
//             })
//           }
//         >
//           Deploy Contract
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MainPage;

"use client";
import React, { useEffect, useState } from "react";
import {
  useAccount,
  useDeployContract,
  useWaitForTransactionReceipt,
  usePublicClient,
  useWriteContract,
} from "wagmi";
import abii from "../abii.json";
import newAbi from "../new.json";
import { Preview } from "./components/Preview";
import { writeContract } from "viem/actions";

interface Transaction {
  creates?: `0x${string}`;
  // Add other properties of the transaction object as needed
}

const MainPage = () => {
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  const [contractAddress, setContractAddress] = useState("");
  const [message, setMessage] = useState("");
  const { address } = useAccount();
  // const { data: hash, error, isPending, deployContract } = useDeployContract();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const publicClient = usePublicClient();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (address) {
      setAccount(address);
    }
  }, [address]);

  useEffect(() => {
    async function getContractAddress() {
      if (isConfirmed && hash && publicClient) {
        try {
          const receipt = await publicClient.getTransactionReceipt({ hash });
          if (receipt.contractAddress) {
            setContractAddress(receipt.contractAddress);
          } else if (receipt.status === "success") {
            const tx = (await publicClient.getTransaction({
              hash,
            })) as Transaction;
            if (tx.creates) {
              setContractAddress(tx.creates);
            } else {
              setContractAddress("");
            }
          } else {
            setContractAddress("");
            setMessage("Transaction was not successful");
          }
        } catch (error) {
          console.error("Error getting contract address:", error);
          setMessage("Error getting contract address");
          setContractAddress("");
        }
      }
    }

    getContractAddress();
  }, [isConfirmed, hash, publicClient]);

  // const handleDeploy = () => {
  //   try {
  //     deployContract({
  //       abi: abii,
  //       args: [
  //         "nama",
  //         "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5",
  //         "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5",
  //       ],
  //       bytecode:
  //         "0x60806040523480156200001157600080fd5b50604051620016ca380380620016ca8339810160408190526200003491620000a9565b600262000042848262000234565b50600380546001600160a01b039384166001600160a01b031991821617909155600480549290931691161790555062000300565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b0381168114620000a457600080fd5b919050565b600080600060608486031215620000bf57600080fd5b83516001600160401b0380821115620000d757600080fd5b818601915086601f830112620000ec57600080fd5b81518181111562000101576200010162000076565b604051601f8201601f19908116603f011681019083821181831017156200012c576200012c62000076565b816040528281526020935089848487010111156200014957600080fd5b600091505b828210156200016d57848201840151818301850152908301906200014e565b6000848483010152809750505050620001888187016200008c565b935050506200019a604085016200008c565b90509250925092565b600181811c90821680620001b857607f821691505b602082108103620001d957634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200022f576000816000526020600020601f850160051c810160208610156200020a5750805b601f850160051c820191505b818110156200022b5782815560010162000216565b5050505b505050565b81516001600160401b0381111562000250576200025062000076565b6200026881620002618454620001a3565b84620001df565b602080601f831160018114620002a05760008415620002875750858301515b600019600386901b1c1916600185901b1785556200022b565b600085815260208120601f198616915b82811015620002d157888601518255948401946001909101908401620002b0565b5085821015620002f05787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6113ba80620003106000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c806391744b491161006657806391744b491461011b578063b9a6aefc1461012e578063bebcb55e14610141578063c1636a8914610154578063eb86ba6c1461016757600080fd5b8063012f52ee1461009857806305c2b326146100c85780632036a7d5146100f15780634f029ba214610106575b600080fd5b6100ab6100a6366004610822565b61017a565b6040516001600160a01b0390911681526020015b60405180910390f35b6100ab6100d6366004610822565b6001602052600090815260409020546001600160a01b031681565b6100f96101a4565b6040516100bf919061083b565b6101196101143660046108a4565b610266565b005b6101196101293660046108a4565b6102c2565b61011961013c3660046108a4565b6103a5565b61011961014f3660046108a4565b610452565b6101196101623660046108c6565b6104fe565b6100ab6101753660046108f9565b61063d565b6000818154811061018a57600080fd5b6000918252602090912001546001600160a01b0316905081565b600080546060919067ffffffffffffffff8111156101c4576101c461092e565b6040519080825280602002602001820160405280156101ed578160200160208202803683370190505b50905060005b600054811015610260576000818154811061021057610210610944565b9060005260206000200160009054906101000a90046001600160a01b031682828151811061024057610240610944565b6001600160a01b03909216602092830291909101909101526001016101f3565b50919050565b604051636c9fd5fd60e11b81523360048201526001600160a01b0382169063d93fabfa90602401600060405180830381600087803b1580156102a757600080fd5b505af11580156102bb573d6000803e3d6000fd5b5050505050565b806002816001600160a01b0316631865c57d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610303573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103279190610970565b60048111156103385761033861095a565b1461034257600080fd5b6040516312b792a760e31b81526001600160a01b038316906395bc95389061036f90600390600401610991565b600060405180830381600087803b15801561038957600080fd5b505af115801561039d573d6000803e3d6000fd5b505050505050565b806001816001600160a01b0316631865c57d6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103e6573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061040a9190610970565b600481111561041b5761041b61095a565b1461042557600080fd5b6040516312b792a760e31b81526001600160a01b038316906395bc95389061036f90600290600401610991565b806002816001600160a01b0316631865c57d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610493573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b79190610970565b60048111156104c8576104c861095a565b146104d257600080fd5b6040516312b792a760e31b81526001600160a01b038316906395bc95389061036f906004908101610991565b816000816001600160a01b0316631865c57d6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561053f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105639190610970565b60048111156105745761057461095a565b1461057e57600080fd5b604051636c9fd5fd60e11b81526001600160a01b03838116600483015284169063d93fabfa90602401600060405180830381600087803b1580156105c157600080fd5b505af11580156105d5573d6000803e3d6000fd5b50506040516312b792a760e31b81526001600160a01b03861692506395bc9538915061060690600190600401610991565b600060405180830381600087803b15801561062057600080fd5b505af1158015610634573d6000803e3d6000fd5b50505050505050565b600354600090610655906001600160a01b03166107a5565b600354600454604051600092339287926001600160a01b03928316929091169061067e90610815565b6001600160a01b039485168152928416602084015290831660408301529091166060820152608001604051809103906000f0801580156106c2573d6000803e3d6000fd5b5060008054600180820183557f290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e56390910180546001600160a01b03199081166001600160a01b0386811691821790935588855260209390935260409384902080549091168317905591516323b872dd60e01b81523360048201526024810191909152604481018890529192508516906323b872dd906064016020604051808303816000875af1158015610778573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079c91906109b9565b50949350505050565b6040516001600160a01b03821660248201526107ed9060440160408051601f198184030181529190526020810180516001600160e01b031663161765e160e11b1790526107f0565b50565b6107ed8180516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b6109a9806109dc83390190565b60006020828403121561083457600080fd5b5035919050565b6020808252825182820181905260009190848201906040850190845b8181101561087c5783516001600160a01b031683529284019291840191600101610857565b50909695505050505050565b80356001600160a01b038116811461089f57600080fd5b919050565b6000602082840312156108b657600080fd5b6108bf82610888565b9392505050565b600080604083850312156108d957600080fd5b6108e283610888565b91506108f060208401610888565b90509250929050565b60008060006060848603121561090e57600080fd5b8335925061091e60208501610888565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052602160045260246000fd5b60006020828403121561098257600080fd5b8151600581106108bf57600080fd5b60208101600583106109b357634e487b7160e01b600052602160045260246000fd5b91905290565b6000602082840312156109cb57600080fd5b815180151581146108bf57600080fdfe60e060405234801561001057600080fd5b506040516109a93803806109a983398101604081905261002f916100b6565b6001600160a01b0393841660805291831660c052600180546001600160a01b0319169284169283178155921660a0819052600090815260026020526040808220805460ff1990811686179091559282529020805490911682179055805460ff60a01b1916905561010a565b80516001600160a01b03811681146100b157600080fd5b919050565b600080600080608085870312156100cc57600080fd5b6100d58561009a565b93506100e36020860161009a565b92506100f16040860161009a565b91506100ff6060860161009a565b905092959194509250565b60805160a05160c05161085e61014b60003960008181610239015281816102750152818161036f01526104530152600061033d01526000505061085e6000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80637b103999116100715780637b1039991461013257806395bc953814610145578063ae8421e114610158578063c19d93fb14610160578063d93fabfa14610174578063dbbc830b146101a457600080fd5b806308551a53146100ae5780631865c57d146100de5780633ccfd60b146100ee5780637022b58e146100f85780637048027514610100575b600080fd5b6000546100c1906001600160a01b031681565b6040516001600160a01b0390911681526020015b60405180910390f35b60005b6040516100d5919061070c565b6100f66101d7565b005b6100f6610557565b6100f661010e366004610734565b6001600160a01b03166000908152600260205260409020805460ff19166001179055565b6001546100c1906001600160a01b031681565b6100f6610153366004610764565b610589565b6100f66105b6565b6001546100e190600160a01b900460ff1681565b6100f6610182366004610734565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6101c76101b2366004610734565b60026020526000908152604090205460ff1681565b60405190151581526020016100d5565b3360009081526002602052604090205460ff1615156001146102345760405162461bcd60e51b81526020600482015260116024820152702ca7aa9020a922902727aa1020a226a4a760791b60448201526064015b60405180910390fd5b61025d7f0000000000000000000000000000000000000000000000000000000000000000610645565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156102c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e89190610785565b90506102f381610690565b600061030082600a6107b4565b9050600061030f6064836107d1565b905061031a81610690565b600061032682856107f3565b60405163a9059cbb60e01b81526001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081166004830152602482018590529192507f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb906044016020604051808303816000875af11580156103ba573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103de9190610806565b61042a5760405162461bcd60e51b815260206004820152601760248201527f436f6d70616e79207472616e73666572206661696c6564000000000000000000604482015260640161022b565b60005460405163a9059cbb60e01b81526001600160a01b039182166004820152602481018390527f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb906044016020604051808303816000875af115801561049e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104c29190610806565b6105075760405162461bcd60e51b8152602060048201526016602482015275111c9a5d995c881d1c985b9cd9995c8819985a5b195960521b604482015260640161022b565b60005460408051848152602081018490526001600160a01b039092169133917f6562355720ad5e9816350753de199edab487334dc9b97f1b15e35e1907ca7ed5910160405180910390a350505050565b6000546001600160a01b0316331461056e57600080fd5b60018054819060ff60a01b1916600160a01b825b0217905550565b6001805482919060ff60a01b1916600160a01b8360048111156105ae576105ae6106f6565b021790555050565b6000546001600160a01b031633146105cd57600080fd5b600154604051631b6161b560e31b81523060048201526001600160a01b039091169063db0b0da890602401600060405180830381600087803b15801561061257600080fd5b505af1158015610626573d6000803e3d6000fd5b5050600180546002935090915060ff60a01b1916600160a01b83610582565b6040516001600160a01b038216602482015261068d9060440160408051601f198184030181529190526020810180516001600160e01b031663161765e160e11b1790526106d1565b50565b61068d816040516024016106a691815260200190565b60408051601f198184030181529190526020810180516001600160e01b031663f5b1bba960e01b1790525b61068d8180516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b634e487b7160e01b600052602160045260246000fd5b602081016005831061072e57634e487b7160e01b600052602160045260246000fd5b91905290565b60006020828403121561074657600080fd5b81356001600160a01b038116811461075d57600080fd5b9392505050565b60006020828403121561077657600080fd5b81356005811061075d57600080fd5b60006020828403121561079757600080fd5b5051919050565b634e487b7160e01b600052601160045260246000fd5b80820281158282048414176107cb576107cb61079e565b92915050565b6000826107ee57634e487b7160e01b600052601260045260246000fd5b500490565b818103818111156107cb576107cb61079e565b60006020828403121561081857600080fd5b8151801515811461075d57600080fdfea26469706673582212203cd7c4736490f4dd8eb5fcc7961d23d85b085073d5d8909b8e1c688343e3c33564736f6c63430008180033a26469706673582212200551a806611526465cf5a887e3c593a5f10e1e254b4e92b4ca73d5210d7cf10c64736f6c63430008180033",
  //     });
  //   } catch (error) {
  //     console.error("Error deploying contract", error);
  //     setMessage("Error deploying contract");
  //   }
  // };

  const handleDeploy = () => {
    try {
      writeContract({
        abi: newAbi,
        address: "0xfa87eb972066e19c337f222368200418034127e3",
        functionName: "createEscrow",
        args: [
          "nameee",
          "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5",
          "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5",
        ],
      });
    } catch (error) {
      console.error("Error deploying contract", error);
      setMessage("Error deploying contract");
    }
  };

  return (
    // <div>
    //   <button
    //     onClick={() =>
    //       writeContract({
    //         abi: newAbi,
    //         address: "0xfa87eb972066e19c337f222368200418034127e3",
    //         functionName: "createEscrow",
    //         args: [
    //           "nameee",
    //           "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    //           "0x5073c3929c9BdECd87Cc63068Fd3185F0b6f22A5",
    //         ],
    //       })
    //     }
    //   >
    //     Transfer
    //   </button>
    //   <h1 className="text-xl font-bold">Organization Account</h1>
    //   <div>{account ? account : "No account connected"}</div>

    //   <h1 className="text-xl font-bold">Deploy Contracts with params</h1>
    //   <div>
    //     <button onClick={handleDeploy} disabled={isPending}>
    //       {isPending ? "Deploying..." : "Deploy Contract"}
    //     </button>
    //   </div>
    //   {(hash || isConfirming || isConfirmed || error || message) && (
    //     <div>
    //       {hash && <p>Transaction Hash: {hash}</p>}
    //       {isConfirming && <p>Waiting for confirmation...</p>}
    //       {isConfirmed && (
    //         <div>
    //           <p>Transaction confirmed.</p>
    //           {contractAddress && (
    //             <p>Contract deployed at: {contractAddress}</p>
    //           )}
    //         </div>
    //       )}
    //       {error && <p>Error: {error.message}</p>}
    //       {message && <p>{message}</p>}
    //     </div>
    //   )}

    //   <h1 className="text-xl font-bold"> Generate Api Key</h1>
    //   <br />

    //   <h1 className="text-xl font-bold"> History Transactions</h1>
    //   <br />

    //   <h1 className="text-xl font-bold"> Code Snippets</h1>
    //   <br />
    // </div>

    <div>
      {/* <h1> ui</h1> */}
      <br />
      <Preview/>
    </div>
  );
};

export default MainPage;
