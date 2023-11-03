import { Form, useActionData, useLoaderData, useNavigate, useSubmit, } from '@remix-run/react'
import { Card, Page, Text, Toast, LegacyStack, Spinner, DropZone, Button, Thumbnail, Frame } from '@shopify/polaris'
import React, { useState, useEffect } from 'react'
import { json } from '@remix-run/node'

import { BulkUploadss } from '~/db.server'
import fs from 'fs'
import path from 'path'
// import Product from '../db.server'
import { parseStringPromise } from 'xml2js'
// const ngrok = require('ngrok')
import {
    Bulkstageupload,
    BulkDataupload,
    BulkOperationRunMutation,
    GenerateWebhook,
    ProductGenerateWebhook
} from '../../api/api.js'

// let data=require('../../upload/csv')
import csvtojson from 'csvtojson'
import { ErrorBoundary } from './app.jsx'
// const path = require('path')

const jsonfilePath = './upload/jsonL/myjson.jsonl'
const jspath = './upload/jsonL'
const cspload = './upload/csv'
// const jsonupload = '/upload/jsonL'
// const  Product =require('../db/product')
// window.Buffer = window.Buffer || require("buffer").Buffer

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, cspload)
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '' + file.originalname)
//     }
// })

// const uploadMiddleware = multer({ storage })

export const loader = async () => {

    // const filename = `${Date.now()}newfile.jsonl`;
    // const data = 'This is the content of the new file.';
    // let fiPath=path.join(jsonupload,filename)
    // fs.writeFile(fiPath, data, (err) => {
    //   if (err) {
    //     console.error('Error creating the file:', err);
    //   } else {
    //     console.log('File created successfully.');
    //   }
    // })
    // let result = await fetch('http://localhost:3000/tests')
    // // result = await result.json()
    // console.log('result', result)



    return null
}

export const action = async ({ request }) => {

    let filedata = await request.formData()
    let filess = filedata.get('csvFile')
    console.log('files', filess)
    console.log('size', filess.size)
    let ext = filess.name.split('.').pop();
    if (filess.size > 1000000 || ext !== 'csv') {
        //shuold not be > 1 MB
        console.log('errr ')
        return json({ error: `File requirement doesn't match... `, status: false })
    } else {

        // let cb_urll = await ngrok.connect(3000)
        // console.log('cbb',cb_urll)
        // return null
        const csvFile = new FormData()
        csvFile.append('csvfile', filess)
        console.log('cs', csvFile)
        let res = await fetch('http://localhost:5000/upload', { method: "post", body: csvFile })
        res = await res.json()
        console.log('res', res)
        const filepath = path.join(cspload, res.filedata)
        // const filedat = new FormData()
        const myObject = [];

        if (res) {
            console.log('sdh')
            let jsonArray = await csvtojson().fromFile(filepath)
            const jsonData = jsonArray.map((data) => {
                let obj = { input: data }
                myObject.push(obj)
            })
        }

        console.log('js', myObject)
        let jsonLdata = myObject.map(obj => JSON.stringify(obj)).join('\n')

        let jsonlFileName = 'data.jsonl'
        fs.writeFileSync(jsonlFileName, jsonLdata, 'utf-8')
        const JsonLfile = new FormData()

        // let file = fs.readFileSync(path.join(jspath, 'myjson.jsonl'))
        // console.log('ff', file)
        // const a=fs.createReadStream(jsonfilePath)
        // console.log('xjh',a)

        const blob = new Blob([jsonLdata], { type: 'application/jsonl' })
        const jsFile = new File([blob], "myjsonn.jsonl", { type: 'application/jsonl' })
        // let asd=fs.createReadStream(jsonfilePath)
        // console.log('adfsd',fs.ReadStr)
        // JsonLfile.append('file',fs.createReadStream(jsonlFileName))
        console.log('dt', JsonLfile)
        // console.log('sda',JSON.parse(JsonLfile))   
        // console.log('sds',jsFile) 

        console.log('files', filess)
        try {

            // step 1 initiat bulk upload
            let api_1 = await Bulkstageupload()
            console.log('step 1', api_1)
            if (api_1.data.stagedUploadsCreate.stagedTargets) {
                let stageddata = api_1.data.stagedUploadsCreate.stagedTargets[0].parameters
                stageddata.map((data) => {
                    // console.log('data.name',data.name)
                    JsonLfile.append(data.name, data.value)
                })
                JsonLfile.append('file', jsFile)
                // JsonLfile.append('file', JSON.stringify(myObject))

                console.log('formdata ', JsonLfile)
                // return null
                try {
                    //  step 2 file upload
                    let api_2 = await BulkDataupload(JsonLfile)
                    console.log('api_2 ', api_2)

                    if (api_2) {

                        let resp = await parseStringPromise(api_2.data)
                        let key = resp.PostResponse.Key[0]
                        console.log('key', resp)
                        console.log('key', key)

                        if (key) {
                            try {
                                //  step 3 BulkOperationRunMutation 
                                let step3 = await BulkOperationRunMutation(key)
                                console.log('step3', step3)

                                if (step3.data.bulkOperationRunMutation.bulkOperation) {
                                    return json({ data: step3, status: true })
                                    // let cb_url = await ngrok.connect(3000)
                                    // console.log('cb ur ', cb_url)
                                    // try {
                                    //     //  step 4 webHook                                   
                                    //     let result = await ProductGenerateWebhook(cb_url)
                                    //     console.log('webhook ', result)
                                    //     return json({ data: result, status: true })

                                    // } catch (error) {
                                    //     console.log('webhook error', error)
                                    //     return json({ data: 'something went wrong', status: false, error: error })
                                    // }

                                } else {
                                    return json({ data: step3, status: false, error: step3.data.bulkOperationRunMutation.userErrors[0].message })
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
    const submit = useSubmit()
    const Navigate = useNavigate()
    console.warn('loader data', Loaderdata)

    const [msg, setMsg] = useState(false)
    const [errmsg, seterrMsg] = useState(false)
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        if (action_data) {
            console.warn('action data', action_data)
            action_data.status ? (setMsg(true), setLoader(false), setTimeout(() => { Navigate('/app') }, 3500)) : (seterrMsg(true), setLoader(false))
        }
    }, [action_data])

    console.warn('action data', action_data)

    return (
        <Page title='Bulk Upload'>
            <Frame>
                <Card>
                    <Text>Bulk Upload for Product</Text>
                    {/* <DropZone dropOnPage onDrop={handleDropZoneDrop}>
                    {uploadedFiles}
                    {uploadMessage}
                </DropZone> */}
                    <Form encType='multipart/form-data' method='post'>
                        <input type='file' name='csvFile' />
                        {/* <p>upload ".csv " file only</p> */}
                        <Button submit primarySuccess onClick={() => setLoader(true)}>
                            {loader ? <Spinner size='small' /> : "Upload"}
                        </Button>
                    </Form>
                    <br />
                    {/* <Button submit>Upload File</Button> */}
                    {/* <Button onClick={handleUplaod}>Upload File</Button> */}
                    {errmsg ? <p style={{ color: "red" }}>{action_data.error}</p> : null}
                </Card>
                {msg ? <Toast onDismiss={() => setMsg(false)} content={'Bulk Operation initiated... '} duration={4000}></Toast> : null}
                {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={6000} error></Toast> : null}
            </Frame>

        </Page>
    )
}

export default BulkUpload


// fs.createReadStream(filess)
//     .pipe(csv())
//     .on('data', (row) => {
//         const jsonObject = {
//             ...row,
//         }
//         jsonLdata.push(JSON.stringify({ "input": jsonObject }))
//     })
//     .on('end', () => {
//         fs.writeFileSync(jsonfilePath, jsonLdata.join('\n'))
//         console.log('jsonL file.. created')
//     })


// let filee=new FormData()
// filee.append('file',filedata)


// console.log('csv filees',typeof(filee))






// uploadMiddleware.single('file')(request, null, async (err) => {
//     if (err) {
//         return json({ error: 'File upload failed' });
//     }

//     if (!request.file) {
//         return json({ error: 'No file uploaded' });
//     }

//     // Access the uploaded file via request.file
//     const file = request.file;

//     // Now you can process the uploaded file as needed
//     console.log('Uploaded file:', file.originalname);

//     return json({ message: 'File uploaded successfully' });
// });
// console.log('csv file', typeof(csvfile))

// const result = []
// const bufStream = new BufferStream(csvfile)

// bufStream.pipe(csv())
//     .on('data', (data) => result.push(data))
//     .on('end', (result) => {
//         console.log(JSON.stringify(result))
//     })

// fs.readFileSync()



// const bodydata = await request.formData()
// console.log('request',filedata)
// console.log('body data',bodydata)
// let csFile=new  FormData()
// csFile.append('filee',bodydata.get('file'))
// console.log('files',fileInput)


// if (fileInput) {
//     const files = Array.isArray(fileInput) ? fileInput : [fileInput];
//     console.log('testt')
//     for (const file of files) {
//         const fileBuffer = await file.arrayBuffer();
//         console.log('first data', fileBuffer)
//         // You can now process or save the file data as needed
//         // For example, you can save it to the server or perform other operations.
//     }
// }

// const filed = fs.readFileSync(csFile.get('filee'), 'utf8');
// papaparse.parse(filed, {
//     header: true,
//     dynamicTyping: true,
//     complete: function (results) {
//         console.log(results.data);
//     }
// })