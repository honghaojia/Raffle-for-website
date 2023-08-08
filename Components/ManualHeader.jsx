import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export function ManualHeader() {
    const {
        enableWeb3,
        account,
        isWeb3Enabled,
        Moralis,
        deactivateWeb3,
        isWeb3EnableLoading,
    } = useMoralis()

    useEffect(() => {
        if (typeof window !== "undifined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])
    //useEffect will re-render your page when dependency array elements change
    //No dependency array if ,run anytime something re-renders
    //blank dependency array , run onetime only
    //give dependency array , run when something in array changes

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [enableWeb3])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...
                    {account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        try {
                            await enableWeb3()
                            window.localStorage.setItem("connected", "injected")
                        } catch (e) {
                            console.log(e)
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
