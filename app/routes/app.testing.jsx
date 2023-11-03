// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
import { json } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigate, useSubmit } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import csvtojson from 'csvtojson'
import { parseStringPromise } from 'xml2js'
import path from 'path'
import fs from 'fs'
import axios from 'axios'
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/graphql.json'
const token = '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'
const cspload = './upload/csv'
const jsonFile = 'bulkjson.jsonl'

// let dat=require('../../upload/csv')

export const action = async ({ request }) => {


    let filedata = await request.formData()
    let filess = filedata.get('csvFile')

    let filedat = new FormData()
    filedat.append('csvfile', filess)
    console.log('files', filess)

    let res = await fetch('http://localhost:3000/upload', { method: "post", body: filedat })
    res = await res.json()
    // console.log('htsdhas',fileUploadHandler(filess).then((res)))

    const filepath = path.join(cspload, res.filedata)

    console.log('ress', res)
    const myObject = [];

    // if (res) {
    //     // console.log('sdh' )\
    //     let jsonArray = await csvtojson().fromFile(filepath)
    //     const jsonData = jsonArray.map((data, i) => {
    //         let obj = { input: data }
    //         myObject.push(obj)
    //     })
    // }

    // console.log('js', myObject)
    // let jsonLdata = myObject.map(obj => JSON.stringify(obj)).join('\n')
    // fs.writeFileSync(jsonFile, jsonLdata)
    const JsonLfile = new FormData()
    // JsonLfile.append('file', fs.createReadStream(jsonFile))
    // console.log('file type', typeof (JsonLfile))

    try {
        const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }
        let graphql = JSON.stringify({
            query: `mutation {
                stagedUploadsCreate(input:{
                  resource: BULK_MUTATION_VARIABLES,
                  filename: "bulk_op_vars",
                  mimeType: "text/jsonl",
                  httpMethod: POST
                }){
                  userErrors{
                    field,
                    message
                  },
                  stagedTargets{
                    url,
                    resourceUrl,
                    parameters {
                      name,
                      value
                    }
                  }
                }
              }
              `
        })
        let api_1 = await fetch(url, { body: graphql, headers: header, method: 'post' })
        api_1 = await api_1.json()
        console.log('api_1', api_1)
        if (api_1.data.stagedUploadsCreate.stagedTargets) {
            let stageddata = api_1.data.stagedUploadsCreate.stagedTargets[0].parameters
            stageddata.map((data) => {
                // console.log('data.name',data.name)
                JsonLfile.append(data.name, data.value)
            })
            try {
                let config = {
                    method: 'post',
                    url: 'https://shopify-staged-uploads.storage.googleapis.com/',
                    data: JsonLfile
                }
                let api_2_res = await axios(config)
                // let api_2_res = await fetch('https://shopify-staged-uploads.storage.googleapis.com/', {
                //     method: 'post',
                //     body: JsonLfile
                // })
                // api_2_res = await api_2_res.json()
                console.log('api_2', api_2_res)

                if (api_2_res) {
                    let resp = await parseStringPromise(api_2_res.data)
                    let key = resp.PostResponse.Key[0]
                    console.log('key', resp)
                    console.log('key', key)


                    let productMutation = `mutation call($input: ProductInput!) {productCreate(input: $input) {product {id title variants(first: 10) {edges {node {id title inventoryQuantity}}}}userErrors {message field}}}`
                    let BulkMutaion = JSON.stringify({
                        query: `mutation {
                            bulkOperationRunMutation(
                                mutation: "${productMutation}",
                                stagedUploadPath: "${key}") {
                                bulkOperation {
                                id
                                url
                                status
                                }
                                userErrors {
                                message
                                field
                                }
                            }
                            }`

                    })
                    try {
                        let api_3 = await fetch(url, { method: 'post', body: BulkMutaion, headers: header })
                        api_3 = await api_3.json()
                        console.log('api_3', api_3)
                    } catch (error) {
                        console.log('api_3 error', error)
                        return json({ data: error, status: false })
                    }

                }
                // console.log('api_2', api_2_res.data)


            } catch (error) {
                console.log('api_2 error', error)
                return json({ data: error, status: false })

            }
        } else {
            return json({ data: api_1, status: false })
        }


    } catch (error) {
        console.log('api_1 error', error)
        return error
    }

    return null

}

export const loader = async ({ request }) => {


    // let result = await (await fetch('http://localhost:3000/tests'))
    // console.log('resultt', result)
    // result = await result.json()
    // console.log('res', result)
    return null
}





export default function Test() {
    const loader = useLoaderData()
    const [file, setfiles] = useState('')
    console.log('loader', loader)

    const test = async () => {
        let filedata = new FormData()
        filedata.append('csvfile', file)
        console.log('fil', typeof (filedata))
        let res = await fetch('http://localhost:3000/upload', {
            method: "post",
            body: filedata,
        })
        res = await res.json()
        // console.log('htsdhas',fileUploadHandler(filess).then((res)))
        console.log('res', res)

    }
    const shdg = () => {
        const parameters = [
            {
                "name": "Content-Type",
                "value": "text/jsonl"
            },
            {
                "name": "success_action_status",
                "value": "201"
            },
            {
                "name": "acl",
                "value": "private"
            },
            {
                "name": "key",
                "value": "tmp/83644645669/bulk/434abce6-3c2f-4d84-8db7-a62de580891f/bulk_op_vars"
            },
            {
                "name": "x-goog-date",
                "value": "20231026T124601Z"
            },
            {
                "name": "x-goog-credential",
                "value": "merchant-assets@shopify-tiers.iam.gserviceaccount.com/20231026/auto/storage/goog4_request"
            },
            {
                "name": "x-goog-algorithm",
                "value": "GOOG4-RSA-SHA256"
            },
            {
                "name": "x-goog-signature",
                "value": "56c35e95c3dd9a6baaea62425fd812b1a901762ca9ef3161816829b5364e099c585f8a5b4f1a1d2ed16cfd46175ce3d8c316cd1420b07756665dde751e6aad21b8aaa7c15fcaec4d3f5231a80061d027a45e13ee8bba689c088868bc1b0b0058062801d70315d1e5c117bbb943feec492fd3f40a5ea1a949f4e0fbe2e4c0ad2e77707a05f76298676d830c8aabcf014242318aabbbff520c6fd58c2115a0eeca3b02eae5d9aac99406f1c61a073fe6eed0468e93c4af29868ebbb085ade7ed8e27cebacba55ee4b59802038abdb9f063e0a7f15e02260ca62cc3b5c33e78cae7dfd6f54ba0bedf3614e61365e555133b921dc061a4de27e1625de88065bb1f32"
            },
            {
                "name": "policy",
                "value": "eyJjb25kaXRpb25zIjpbeyJDb250ZW50LVR5cGUiOiJ0ZXh0XC9qc29ubCJ9LHsic3VjY2Vzc19hY3Rpb25fc3RhdHVzIjoiMjAxIn0seyJhY2wiOiJwcml2YXRlIn0sWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMSwyMDk3MTUyMF0seyJidWNrZXQiOiJzaG9waWZ5LXN0YWdlZC11cGxvYWRzIn0seyJrZXkiOiJ0bXBcLzgzNjQ0NjQ1NjY5XC9idWxrXC80MzRhYmNlNi0zYzJmLTRkODQtOGRiNy1hNjJkZTU4MDg5MWZcL2J1bGtfb3BfdmFycyJ9LHsieC1nb29nLWRhdGUiOiIyMDIzMTAyNlQxMjQ2MDFaIn0seyJ4LWdvb2ctY3JlZGVudGlhbCI6Im1lcmNoYW50LWFzc2V0c0BzaG9waWZ5LXRpZXJzLmlhbS5nc2VydmljZWFjY291bnQuY29tXC8yMDIzMTAyNlwvYXV0b1wvc3RvcmFnZVwvZ29vZzRfcmVxdWVzdCJ9LHsieC1nb29nLWFsZ29yaXRobSI6IkdPT0c0LVJTQS1TSEEyNTYifV0sImV4cGlyYXRpb24iOiIyMDIzLTEwLTI3VDEyOjQ2OjAxWiJ9"
            }
        ]
        let dataa = parameters.map((data) => {
            console.log('key', data.name, data.value)
        })
    }
    // shdg()

    return (
        <div>
            <form encType='multipart/form-data' method='post'>
                <input type='file' name='csvFile' />
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}
