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
var REF_LINK = NaN

var PROVIDER = NaN
var SELECTED_ADDRESS = NaN

function shortAddress(address, tailsLength = 5) {
    return address.substring(0, tailsLength) + '...' + address.substring(address.length - tailsLength - 1, address.length)
}

function getReferrer() {
    const referrerFromStore = localStorage.getItem('REFERRER')
    const referrerFromLink = getQueryString('ref')
    
    if (referrerFromLink) {
        localStorage.setItem('REFERRER', referrerFromLink)
        return referrerFromLink
    }
    
    if (referrerFromStore) {
        return referrerFromStore
    }
    
    return DEFAULT_REFERRER
}

function getQueryString(name) {
    var queryString = window.location.search.substring(1)
    var queries = queryString.split('&')

    for (let queryid = 0; queryid < queries.length; queryid++) {
        let query = queries[queryid].split('=')

        if (query[0] === name) {
            return typeof query[1] === undefined ? true : decodeURIComponent(query[1])
        }
    }
    return false
}

function copyRefLink() {
    if (typeof (SELECTED_ADDRESS) == 'string') {
        let value = window.location.origin + window.location.pathname + '?ref=' + SELECTED_ADDRESS
        var tmp = $("<textarea>")
        $("body").append(tmp)
        tmp.val(value).select()
        document.execCommand("copy")
        tmp.remove()
    }
}

function updateAddress() {
    SELECTED_ADDRESS = PROVIDER.selectedAddress

    if (isNaN(SELECTED_ADDRESS)) {
        SELECTED_ADDRESS = PROVIDER.accounts[0]
    }
    
    if (typeof (SELECTED_ADDRESS) == 'string') {
        CONNECT_BUTTON.off('click', web3connect)
        CONNECT_BUTTON.removeClass('disconnected')
        CONNECT_BUTTON.children('span').text(shortAddress(SELECTED_ADDRESS))
        CONNECT_BUTTON.addClass('connected')
        
        REF_LINK.children('.button-copy').on('click', copyRefLink)
        REF_LINK.removeClass('disable')
        REF_LINK.children('.refferal-link').text(window.location.host + '/?ref=' + shortAddress(SELECTED_ADDRESS))
        REF_LINK.children('.refferal-link').attr('href', window.location.origin + window.location.pathname + '?ref=' + SELECTED_ADDRESS)
        REF_LINK.addClass('enable')
    } else {
        PROVIDER = NaN

        CONNECT_BUTTON.on('click', web3connect)
        CONNECT_BUTTON.removeClass('connected')
        CONNECT_BUTTON.children('span').text('ПОДКЛЮЧИТЬ')
        CONNECT_BUTTON.addClass('disconnected')
        
        REF_LINK.children('.button-copy').off('click', copyRefLink)
        REF_LINK.removeClass('enable')
        REF_LINK.children('.refferal-link').text('Вы получите реферальную ссылку сразу после подключения кошелька')
        REF_LINK.children('.refferal-link').removeAttr('href')
        REF_LINK.addClass('disable')
    }
}

function setProviderEvents() {
    PROVIDER.on("accountsChanged", () => {
        updateAddress()
    })
}

async function web3connect() {
    if (await web3check()) {
        return true
    }

    console.log('Opening a dialog', web3Modal)
    try {
        PROVIDER = await web3Modal.connect()
        updateAddress()

        try {
            setProviderEvents()
        } catch (e) {
            console.log('Could not set provider events', e)
        }

        return true
    } catch (e) {
        console.log('Could not get a wallet connection', e)
        return false
    }
}

async function web3check() {
    try {
        PROVIDER = web3.currentProvider
    } catch (e) {
        console.log('Could find web3 provider', e)
        return false
    }
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
    REF_LINK = $('.refferal-link-wrapper')
    
    CONNECT_BUTTON.on('click', web3connect)
    
    setTimeout(() => {
        getReferrer()
        web3check()
    }, 500)
})
