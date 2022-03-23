import "./App.css";
import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import contractABI from "./contractABI.json";
 
const contractAddress = "0x8C8a156cb2246965FB50Ef7c3FE69e809020e943";
 
function App() {
 
    const [account, setAccount] = useState(null);
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
  const [NFTContract, setNFTContract] = useState(null);
  // state for whether app is minting or not.
    const [isMinting, setIsMinting] = useState(false);
 
 
  useEffect(() => {
        if (window.ethereum) {
            setIsWalletInstalled(true);
        }
    }, []);
    useEffect(() => {
      function initNFTContract() {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    setNFTContract(new Contract(contractAddress,contractABI.abi,signer));
      }
      initNFTContract();
  }, [account]);


async function connectWallet() {
      window.ethereum
          .request({
              method: "eth_requestAccounts",
          })
          .then((accounts) => {
              setAccount(accounts[0]);
          })
          .catch((error) => {
              alert("Something went wrong");
          });
  }

  const data = [
    {
        url: "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/5.png",
        param: "handleMint('https://gateway.pinata.cloud/ipfs/QmcMEbU3rc5FDqbaFnQvbaRkbhoVwUwibPDmt6j83kx3Mx')",
    },
    {
      url: "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/4.png",
        param: "handleMint('https://gateway.pinata.cloud/ipfs/QmRJhA64nACrUVsEZHKtK5QnTwefmGrqA9CNVnSaTbWk5W/2')",
    },
    {
      url: "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/3.png",
        param: "handleMint('https://gateway.pinata.cloud/ipfs/QmRJhA64nACrUVsEZHKtK5QnTwefmGrqA9CNVnSaTbWk5W/3')",
    },
    {
      url: "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/2.png",
        param: "handleMint('https://gateway.pinata.cloud/ipfs/QmXWYF8F6JK9pHg3uQytq79iAL1M6j8HVDkn291w273ZS2')",
    },
    {
      url: "https://gateway.pinata.cloud/ipfs/QmXZ3TgRgd5EZEk2DhwGvjf8f6sQJNCrnHzrEw1oHufgnL/1.png",
        param: "handleMint('https://gateway.pinata.cloud/ipfs/QmTuGGY13i8ZcpQ3hsESF5P7SU53cZu4t14PRcw5erG8NX')",
    },
];

async function withdrawMoney(){
  try {

      const response = await NFTContract.withdrawMoney();
      console.log("Received: ", response);
    } catch (err) {
        alert(err);
    }

}

async function handleMint(tokenURI) {
  setIsMinting(true);
      try {
        const options = {value: ethers.utils.parseEther("0.01")};
        const response = await NFTContract.mintNFT(tokenURI, options);
        console.log("Received: ", response);
      } catch (err) {
          alert(err);
      }
      finally {
        setIsMinting(false);
      }
}
if (account === null) {
  return (
    <>
     <div className="container">
       <br/>
      <h1> 🔮 metaschool</h1>
      <h2>NFT Marketplace</h2>
      <p>Buy an NFT from our marketplace.</p>

      {isWalletInstalled ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Install Metamask wallet</p>
      )}
      </div>
      </>
  );
}
return (
  <>
      <div className="container">
      <br/>
      <h1> 🔮 metaschool</h1>

       <h2>NFT Marketplace</h2>
          {data.map((item, index) => (
              <div className="imgDiv">
                  <img
                      src={item.url}
                      // src="https://gateway.pinata.cloud/ipfs/QmQXKXLFd5SPqQtfqmBKHFpU8MFtZqEtQRBkdeGnavsbdJ"
                      key={index}
                      alt="images"
                      width={250}
                      height={250}
                  />
                  <button isLoading={isMinting}
                      onClick={() => {
                          eval(item.param);
                      }}
                  >
                      Mint - 0.01 eth
                  </button>
              </div>
          ))}

 
        </div>
          <div className="lstbtn">
        <button 
                            onClick={() => {
                                withdrawMoney();
                            }}
                        >
                            Withdraw Money from Contract
                 </button>
                 </div>
        </>
    );
}

export default App ;