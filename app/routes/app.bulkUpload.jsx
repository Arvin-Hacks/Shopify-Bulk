import { Form, useActionData, useLoaderData, useNavigate, useSubmit, } from '@remix-run/react'
import { Card, Page, Text, Toast, Button, Frame } from '@shopify/polaris'
import { useState, useEffect, useTransition } from 'react'
import { json } from '@remix-run/node'

import { parseStringPromise } from 'xml2js'
import csv from 'csvtojson'
import {
    Bulkstageupload,
    BulkDataupload,
    BulkOperationRunMutation} from '../api/api.server.js'

// import csvtojson from 'csvtojson'

export const loader = async () => {
    return null
}

export const action = async ({ request }) => {

    let filedata = await request.formData()
    let filess = filedata.get('csvFile')
    console.log('filess',filess?.name)
    let ext = filess.name.split('.').pop();
    if (filess.size > 1000000 || ext !== 'csv' || !filess.name) {
        //shuold not be > 1 MB
        return json({ error: `File requirement doesn't match... `, status: false })
    } else {

        let result = await fetch('https://an7.ec7.ai/?module=API&method=SitesManager.addSite&siteName=ec7webpixels&urls[0]=https://ec-7-webpixels.myshopify.com&urls[1]=http://ec-7-webpixels.myshopify.com&ecommerce=1&excludeUnknownUrls=1&currency=USD&timezone=America/Los_Angeles&token_auth=0a1315f2ff8b60f385734da045446333')
        result = await result.text()
        console.log('res', result)


        // Read csv file and convert into josnL file
        let csvtext=await filess.text()
        let jsonData=await csv().fromString(csvtext)
        const myObject = [];
        jsonData.map((data) => {
            let obj = { input: data }
            myObject.push(obj)
        })

        let jsonLdata = myObject.map(obj => JSON.stringify(obj)).join('\n')

        const JsonLfile = new FormData()
        
        const blob = new Blob([jsonLdata], { type: 'application/jsonl' })
        const jsFile = new File([blob], "myjsonn.jsonl", { type: 'application/jsonl' })
        
        try {

            // step 1 initiat bulk upload
            let api_1 = await Bulkstageupload()
            // console.log('step 1', api_1)
            if (api_1.data?.stagedUploadsCreate?.stagedTargets) {
                let stageddata = api_1.data.stagedUploadsCreate.stagedTargets[0].parameters
                stageddata.map((data) => {
                    JsonLfile.append(data.name, data.value)
                })
                JsonLfile.append('file', jsFile)
                try {
                    //  step 2 file upload 
                    let api_2 = await BulkDataupload(JsonLfile)
                    console.log('api_2 ', api_2)

                    if (api_2) {

                        let resp = await parseStringPromise(api_2.data)
                        let key = resp.PostResponse.Key[0]

                        if (key) {
                            try {
                                //  step 3 Run BulkOperationRunMutation 
                                let step3 = await BulkOperationRunMutation(key)
                                console.log('step3', step3)

                                if (step3?.data?.bulkOperationRunMutation?.bulkOperation) {
                                    // console.log('bulk data',step3)
                                    return json({ data: step3, status: true })
                                    
                                } else {
                                    return json({ data: step3, status: false, error: "Invalid csv file formate or file" })
                                }
                            } catch (error) {
                                console.log('api_3 error', error)
                                return json({ error: 'something went wrong', status: false, data: error })
                            }
                        } else {

                            return json({ data: api_2, status: false, error: 'Something went error' })
                        }
                    }

                } catch (error) {
                    console.log('api_2 error', error)
                    return json({ error: 'something went wrong', status: false, data: error })
                }
            }
            else {
                return json({ error: 'something went wrong', status: false, data: api_1 })
            }
        } catch (error) {
            console.log('api_1 error', error)
            return json({ error: 'something went wrong', status: false, data: error })
        }
    }
    // return null

}


const BulkUpload = () => {
    const Loaderdata = useLoaderData()
    const action_data = useActionData()
    const Navigate = useNavigate()

    const transition=useTransition()
    const state=transition.state==="submitting"

    // console.log("first",state)

    // console.warn('loader data', Loaderdata)

    const [msg, setMsg] = useState(false)
    const [errmsg, seterrMsg] = useState(false)
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        if (action_data) {
            console.warn('action data', action_data)
            action_data.status ? (setMsg(true), setLoader(false), setTimeout(() => { Navigate('/app') }, 2500)) : (seterrMsg(true), setLoader(false))
        }
    }, [action_data])

    // console.warn('action data', action_data)

    return (
        <Page title='Bulk Upload'>
            <Frame>
                <Card>
                    <Text>Bulk Import for Product</Text>
                    
                    <Form encType='multipart/form-data' method='post'>
                        <div >
                         <input type='file' name='csvFile'  style={{padding:"60px 120px",border:"1px dashed gray",cursor:"pointer", }} />
                         
                        </div><br />
                        {/* <p>upload ".csv " file only</p> */}
                        <Button submit primarySuccess onClick={() => setLoader(true)} loading={loader}>
                            {/* {loader ? <Spinner size='small' /> : "Upload"} */}
                            Upload
                        </Button>
                    </Form>                    
                    { state && <p> Action state </p> }

                    <br />                    
                    {errmsg ? <p style={{ color: "red" }}>{action_data.error}</p> : null}
                </Card>
                {msg ? <Toast onDismiss={() => setMsg(false)} content={'Bulk Operation initiated... '} duration={4000}></Toast> : null}
                {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={6000} error></Toast> : null}
            </Frame>

        </Page>
    )
}

export default BulkUpload

