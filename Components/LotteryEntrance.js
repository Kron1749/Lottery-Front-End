import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [minimumValue, setMinimumValue] = useState("0")
    const { runContractFunction: enterTheLottery } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterTheLottery",
        params: {},
        msgValue: minimumValue,
    })

    const { runContractFunction: getMinimumValue } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getMinimumValue",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const minimumValueFromCall = (
                    await getMinimumValue()
                ).toString()
                setMinimumValue(minimumValueFromCall)
                console.log(minimumValue)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Lottery entrance
            {lotteryAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterTheLottery()
                        }}
                    >
                        Enter Lottery
                    </button>
                    Entrance Fee{" "}
                    {ethers.utils.formatUnits(minimumValue, "ether")} ETH
                </div>
            ) : (
                <div>No lottery address detected</div>
            )}
        </div>
    )
}
