import Head from 'next/head'
import {
  Box,
  VStack,
  Center,
  Text
} from '@chakra-ui/react'
import * as React from 'react'
import Navigation from '../components/Navigation'
import Loader from '../components/Loader'
import { useNavigation } from "../src/contexts/navigation.context"
import favicon from "../public/favicon.ico"

export default function HomePage(props) {
  const { defaultWallet, sessionWallet, connected, updateWallet, isOptIntoAsset, setOptIntoAsset, currency, loading, handleFetch } = useNavigation()
  return (
    <>
      <Head>
        <link rel="shortcut icon" href={favicon.src} type="image/x-icon" />
        <title>NextJS Algorand Wallet Connect Boilerplate By Flipping Algos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navigation />
      <Box w="100%" h="100%">
        {!loading ? (
              <>
              <Box mt='2'>
                <Center>
                  <VStack>
                  <Text fontFamily="Share" fontSize='xl'>Loading...</Text>
                  <Loader />
                  </VStack>
                </Center>
              </Box>
              </>
            ) : (
              <>
              <Center>
              <Box pl={{ base: 0, md: 4}} pr={{ base: 0, md: 4}}>
                  <Text fontFamily="Share" fontSize='xl'>NextJS Algorand Wallet Connect Boilerplate By Flipping Algos</Text>
              </Box>
              </Center>
              </>
            )}
      </Box>
    </>
  )
}
