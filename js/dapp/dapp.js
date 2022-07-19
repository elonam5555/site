const Web3 = window.Web3
const Web3Modal = window.Web3Modal.default
const WalletConnectProvider = window.WalletConnectProvider.default

const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
        options: {
            rpc: RPC,
            chainId: CHAIN_ID
        }
    }
}

const web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions
})


var CONNECT_BUTTON = NaN

var PROVIDER = NaN
var SELECTED_ADDRESS = NaN

function shortAddress(address, tailsLength = 5) {
    return address.substring(0, tailsLength) + '...' + address.substring(address.length - tailsLength - 1, address.length)
}

function updateAddress() {
    SELECTED_ADDRESS = PROVIDER.selectedAddress

    if (typeof (PROVIDER.selectedAddress) == 'string') {
        CONNECT_BUTTON.off('click', web3connect)
        CONNECT_BUTTON.removeClass('disconnected')
        CONNECT_BUTTON.children('span').text(shortAddress(SELECTED_ADDRESS))
        CONNECT_BUTTON.addClass('connected')
    } else {
        PROVIDER = NaN

        CONNECT_BUTTON.on('click', web3connect)
        CONNECT_BUTTON.removeClass('connected')
        CONNECT_BUTTON.children('span').text('ПОДКЛЮЧИТЬ')
        CONNECT_BUTTON.addClass('disconnected')
    }
}

function setProviderEvents() {
    PROVIDER.on("accountsChanged", (accounts) => {
        updateAddress()
    });
}

async function web3connect() {
    console.log('Opening a dialog', web3Modal)
    try {
        PROVIDER = await web3Modal.connect()

        updateAddress()
        setProviderEvents()

        return true
    } catch (e) {
        console.log('Could not get a wallet connection', e)
        return false
    }
}

async function web3check() {
    PROVIDER = web3.currentProvider

    if (typeof (PROVIDER.selectedAddress) == 'string') {
        updateAddress()
        setProviderEvents()

        return true
    } else {
        return false
    }
}

$(function () {
    CONNECT_BUTTON = $('.connect-button')
    CONNECT_BUTTON.on('click', web3connect)

    setTimeout(() => {
        web3check()
    }, 500)
})