// in front-end javascript you cannot use require
// import
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi } from "./constants.js"
import { contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log(ethers)

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

function ListenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    // listen for this transaction to finish
    // provider.once without using a promise does not finish at the same time
    // as the ListenForTransactionMine because it enters an event loop
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
        }) // trigger response for event only once and after that delete it
        resolve() // wait for provider.once to finish and then resolve
    })
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!!" //.innerHTML modifies the button label
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Please install metamask!"
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        // provider / connection to the blockchain
        // signer / wallet / someone with gas
        const provider = new ethers.providers.Web3Provider(window.ethereum) // connect to the blockchain node by metamask
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacting with
        // ^ ABI & Address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
                // wait for transaction to mine
            })
            await ListenForTransactionMine(transactionResponse, provider)
            // create a listener for the blockchain
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

// withdraw function
async function withdraw() {
    console.log("Withdrawing...")
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum) // connect to the blockchain node by metamask
        const signer = provider.getSigner()
        console.log(signer)
        // contract that we are interacting with
        // ^ ABI & Address
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw({})
            await ListenForTransactionMine(transactionResponse, provider)
            // create a listener for the blockchain
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
