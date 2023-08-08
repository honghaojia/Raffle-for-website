import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../Constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export function LotteryEntrance() {
    let [entranceFee, setEntranceFee] = useState("0")
    let [numPlayer, setNumPlayer] = useState("0")
    let [recentWinner, setRecentWinner] = useState("0")

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddress ? contractAddress[chainId][0] : null

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getReceneWinner",
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const updateUI = async function () {
        if (isWeb3Enabled) {
            const entranceFeeFromCall = (await getEntranceFee()).toString()
            const numPlayersFromCall = (await getNumPlayers()).toString()
            const receneWinnerFromCall = (await getRecentWinner()).toString()
            setEntranceFee(entranceFeeFromCall)
            setNumPlayer(numPlayersFromCall)
            setRecentWinner(receneWinnerFromCall)
        }
    }
    useEffect(() => {
        updateUI()
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        console.log("success")
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isFetching || isLoading ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance Fee :{" "}
                        {ethers.utils.formatUnits(entranceFee, "ether")}
                        ETH
                    </div>
                    <div>Number Of Players :{numPlayer}</div>
                    <div>Reccent Winner : {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle Address detected !</div>
            )}
        </div>
    )
}
