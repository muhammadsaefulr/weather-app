import { registerSW } from 'virtual:pwa-register'

registerSW({
    immediate: true,
    onRegisteredSW(swScriptUrl){
        console.log('Sw Registred !', swScriptUrl)
    },
    onNeedRefresh() {
        console.log("Network Is Available Now, Need refresh for update content")
    },
    onOfflineReady() {
        console.log("pwa application ready on offline mode")
    }
})