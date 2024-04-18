import nextConnect from 'next-connect'
//import GET_QUERY from "../../queries/getSomeData"
import client from "../../lib/apolloclient"
import { getCookie } from 'cookies-next'
const handler = nextConnect()

handler.post(async (req, res) => {
    //let data = req.body
    //data = JSON.parse(data)
    //let address = getCookie('cw', { req, res })
    //console.log("get getCookie data", address)
    /* 
    await client.mutate({
        mutation: GET_QUERY,
        variables: { 
            address: address 
        }
    }).then((senddata) => {
        //console.log("get data", senddata)
        res.status(200).json(senddata);
    }).catch((err)=>{ 
        console.log("error getting data", err)
    })  */
}) 

export default handler