import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [minimumValue, setMinimumValue] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const { runContractFunction: enterTheLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterTheLottery",
        params: {},
        msgValue: minimumValue,
    })

    const dispatch = useNotification()

    const { runContractFunction: getMinimumValue } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getMinimumValue",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const minimumValueFromCall = (await getMinimumValue()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromCall)
        setNumPlayers(numPlayersFromCall)
        setMinimumValue(minimumValueFromCall)
        console.log(minimumValue)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div>
            Lottery entrance
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterTheLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Lottery
                    </button>
                    Entrance Fee{" "}
                    {ethers.utils.formatUnits(minimumValue, "ether")} ETH Number
                    of Players: {numPlayers}
                    Recent winner: {recentWinner}
                </div>
            ) : (
                <div>No lottery address detected</div>
            )}
        </div>
    )
}
