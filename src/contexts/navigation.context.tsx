import React, { useContext, useEffect, useState } from "react";
import { SessionWallet, PermissionResult, SignedTxn, Wallet } from '../../lib/algorand-session-wallet'
import { getWalletAssetData } from '../../lib/algorand'
import { platform_settings as ps } from '../../lib/platform-conf'
import { PopupPermission, DefaultPopupProps } from '../RequestPopup'

const TOKEN_PAGE_SIZE=6;

export interface FraktionContextType {
  defaultWallet: string;
  sessionWallet: Wallet;
  updateWallet: Function;
  handleFetch: Function;
  tokenList: any;
  algoBalance: any;
  walletAssets: any;
  isOptIntoAsset: any;
  setOptIntoAsset: any;
  isOptOutAsset: any;
  currency: any;
  setCurrency: any;
  connected: Promise<boolean>;
  loading: boolean;
  fetchTokenNextPage: any;
  hasTokenNextPage: boolean;
  popupProps: typeof DefaultPopupProps;
}

export const NavigtionContext = React.createContext<FraktionContextType>({
  //@ts-ignore
  defaultWallet: '',
  //@ts-ignore
  sessionWallet: () => {},
  //@ts-ignore
  updateWallet: () => {},
  //@ts-ignore
  handleFetch: () => {},
  //@ts-ignore
  tokenList: () => {},
  //@ts-ignore
  algoBalance: () => {},
  //@ts-ignore
  walletAssets: () => {},
  //@ts-ignore
  isOptIntoAsset: () => {},
  //@ts-ignore
  setOptIntoAsset: () => {},
  //@ts-ignore
  isOptOutAsset: () => {},
  //@ts-ignore
  currency: () => {},
  //@ts-ignore
  setCurrency: () => {},
  //@ts-ignore
  fetchTokenNextPage: () => {},
  //@ts-ignore
  hasTokenNextPage: true,
  //@ts-ignore
  connected: async (): Promise<boolean> => { return false; },
  //@ts-ignore
  loading: false,
});

export const NavigtionProvider = ({
  children = null,
}: {
  children: JSX.Element | null;
}): JSX.Element => {
  
  const timeout = async(ms: number) => new Promise(res => setTimeout(res, ms));
  const popupCallback = {
    async request(pr: PermissionResult): Promise<SignedTxn[]> {
      let result = PopupPermission.Undecided;
      setPopupProps({isOpen:true, handleOption: (res: PopupPermission)=>{ result = res} })		
      
      async function wait(): Promise<SignedTxn[]> {
        while(result === PopupPermission.Undecided) await timeout(50);

        if(result == PopupPermission.Proceed) return pr.approved()
        return pr.declined()
      }

      //get signed
      const txns = await wait()

      //close popup
      setPopupProps(DefaultPopupProps)

      //return signed
      return txns
    }
  }
  const sw = new SessionWallet(ps.algod.network)
  const [sessionWallet, setSessionWallet] =  useState<any>(sw)
  const [defaultWallet, setDefaultWallet] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  //@ts-ignore
  const [popupProps, setPopupProps] = React.useState<any>(DefaultPopupProps)
  const [connected, setConnected] = React.useState<Promise<boolean>>(sw.connected())
  const [isOptIntoAsset, setOptIntoAsset] = React.useState([])
  const [isOptOutAsset, setOptOutAsset] = React.useState([])
  const [walletAssets, setWalletAssets] = React.useState([])
  const [tokenList, setTokenList] = React.useState([])
  const [algoBalance, setAlgoBalance] = React.useState()
  const [hasTokenNextPage, setHasTokenNextPage] = React.useState<boolean>(true)
  const [currency, setCurrency] = React.useState({asset_id:0, decimal: 6, unitname:"ALGO", rate:"1"})
  let [pageToken, setTokenPage] = useState<number>(0)

  const updateWallet = async (sw: SessionWallet) => {
    setSessionWallet(sw)
    setConnected(sw.connected())
    const defaultAccount = await sessionWallet.getDefaultAccount()
    setDefaultWallet(defaultAccount)
  };
  const fetchTokenNextPage = async () => {
    setHasTokenNextPage(false)
  }
  /* 
  const fetchTokenNextPage = async () => {
    let nextpage = pageToken + 1
    let offset = (nextpage===1)? 0 : TOKEN_PAGE_SIZE * (pageToken)

    const tokensResponse = await fetch('/api/getTokens', {
        method: 'POST',
        body: JSON.stringify({first: TOKEN_PAGE_SIZE, offset: offset})
    })
    const tokensData = await tokensResponse.json()
    pageToken = pageToken == 0 ? 1 : pageToken + 1

    if(TOKEN_PAGE_SIZE > tokensData.data.queryTokens.length){
      setHasTokenNextPage(false)
    }
    setTokenPage(pageToken)
    const getDefaultAccount = await sessionWallet.getDefaultAccount()
    await getWalletAssetData(getDefaultAccount, tokensData.data.queryTokens).then((assetData)=> { 
      if(assetData) {
        setWalletAssets(assetData.walletassets)
        setOptIntoAsset(assetData.assets)
        setOptOutAsset(assetData.optoutassets)
        setTokenList([...tokenList, ...assetData.tokenBal])
        setAlgoBalance(assetData.algoBalance)
      }
  }).catch((err)=>{ 
      console.log("error getWalletAssetData",err)
  }) 
  } */

  const handleFetch = async (sortOrder: string = '') => {
    
    setTokenPage(1)
    setHasTokenNextPage(true)
    setLoading(true)
    /* if(connected) {
      const tokensResponse = await fetch("/api/getTokens", {
          method: 'POST',
          body: JSON.stringify({first: TOKEN_PAGE_SIZE, offset: 0})
      })
      const tokensData = await tokensResponse.json()
      const getDefaultAccount = await sessionWallet.getDefaultAccount()
      await getWalletAssetData(getDefaultAccount, tokensData.data.queryTokens).then((assetData)=> { 
          if(assetData) {
            setWalletAssets(assetData.walletassets)
            setOptIntoAsset(assetData.assets)
            setOptOutAsset(assetData.optoutassets)
            setTokenList(assetData.tokenBal)
            setAlgoBalance(assetData.algoBalance)
          }
      }).catch((err)=>{ 
          console.log("error getWalletAssetData",err)
      }) 
      setLoading(true)
    } else {
      setLoading(true)
    } */
  }

  useEffect(()=>{ 
      const handleFetchCurrentWallet = async () => {
        const defaultAccount = await sessionWallet.getDefaultAccount()
        setDefaultWallet(defaultAccount)
      }
      if(!sessionWallet.connected()) return 
        handleFetchCurrentWallet()
  }, [sessionWallet])

  React.useEffect(()=> {
    //console.log('handleFetch')
    handleFetch()
    if(!connected) return
      updateWallet(sw)

  },[connected])
  //@ts-ignore

  return (
    <NavigtionContext.Provider
      value={{
        defaultWallet,
        sessionWallet,
        updateWallet,
        handleFetch,
        tokenList,
        algoBalance,
        walletAssets,
        isOptIntoAsset,
        setOptIntoAsset,
        isOptOutAsset,
        currency,
        setCurrency,
        fetchTokenNextPage,
        //@ts-ignore
        hasTokenNextPage,
        //@ts-ignore
        connected,
        //@ts-ignore
        loading,
        popupProps
      }}
    >
      {children}
    </NavigtionContext.Provider>
  );
};

export const useNavigation = () => {
  const {
    defaultWallet,
    sessionWallet,
    updateWallet,
    handleFetch,
    tokenList,
    algoBalance,
    walletAssets,
    isOptIntoAsset,
    setOptIntoAsset,
    isOptOutAsset,
    currency,
    setCurrency,
    fetchTokenNextPage,
    hasTokenNextPage,
    connected,
    loading,
    popupProps
  } = useContext(NavigtionContext);
  return {
    defaultWallet,
    sessionWallet,
    updateWallet,
    handleFetch,
    tokenList,
    algoBalance,
    walletAssets,
    isOptIntoAsset,
    setOptIntoAsset,
    isOptOutAsset,
    currency,
    setCurrency,
    fetchTokenNextPage,
    hasTokenNextPage,
    connected,
    loading,
    popupProps
  };
};
