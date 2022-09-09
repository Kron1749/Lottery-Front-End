import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <Component {...pageProps} />
            <Header />
        </MoralisProvider>
    )
}

export default MyApp
