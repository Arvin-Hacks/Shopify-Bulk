import { json } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { Card, Frame, Page, Toast } from '@shopify/polaris'
import axios from 'axios'
import fs from 'fs'
import React, { useEffect, useState } from 'react'

export const action = async ({ request }) => {

    // let data=await getCallbackurl()
    console.log('action url')

    // console.log('action', request.method)
    // let url = 'https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/trlo23avftz3c78wdlck51kd0wf5?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1699422028&Signature=Pbb6f8TMfZ2BDDHFXNhL3KMuqo2MsMnhKoA9kBHcxlIB55A8f6EsrF5gKeV6YbQ19D7GGfN9tLtnaBK7iQALpXK4BEiflngV9mXh4VuNdna24XLupYPDElsPfGKIpoKOZj6FvmYPyNLfnQqhEmpycrgFfmr5%2F2fkJRu264kwBe1kV5uxCJWfAZ8mQDHg%2BvckaeCAKuHv5ZraONJK0dX4kb0214qLYaOdtUp4t1mPzOMmK55GucaZCn5fbG9Zq3QvSr%2FoKKGqOxVocUIw3jGBoaBxXWFpF23t5cTsJbA65NpTjT2SJMDi3m3WY8%2FuJad8X7f1fiF6NUSNk0SI7JZ7rw%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3604442612005.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3604442612005.jsonl&response-content-type=application%2Fjsonl'

    // let jsonlfile = 'Bulkjson.jsonl'
    // let FinalJson = []



    // try {
    //     let response = await axios.get(url, { responseType: 'stream' })
    //     if (response.status === 200) {

    //         const fileStream = fs.createWriteStream(jsonlfile)
    //         response.data.pipe(fileStream)
    //         // const stream = response.data
    //         const lineStream = byline(fs.createReadStream(jsonlfile));
    //         let dt = 0
    //         let dataArray = []

    //         let dtt = await readJSONLFile(lineStream)
    //         console.log('dtt', dtt)

    //         // lineStream.on('data', (line) => {
    //         //     // Parse each line as a JSON object
    //         //     const jsonObject = JSON.parse(line.toString());
    //         //     console.log('dss', line.toString())
    //         //     dataArray.push(jsonObject.data.productCreate);
    //         //     FinalJson.push(jsonObject.data.productCreate) // Add the object to the array

    //         //     console.log('Line:', jsonObject);
    //         //     console.log('Line:', dataArray);
    //         //     // fileData += line.toString() + '\n';

    //         // });

    //         // lineStream.on('end', async () => {
    //         //     console.log('Finished reading the file.');
    //         //     console.log('File Data:', dataArray)
    //         //     // processArray(dataArray);
    //         // })
    //         // console.log('final', dataArray)
    //         // const processArray = (dataArray) => {
    //         // }




    //         // console.log('adad', dt)
    //         // const rl = readLine.createInterface({
    //         //     input: stream,
    //         //     crlfDelay: Infinity,
    //         // })
    //         // rl.on('line', (line) => {
    //         //     try {
    //         //         const jsobject = JSON.parse(line)
    //         //         console.log('parse', jsobject)

    //         //     } catch (error) {
    //         //         console.error('Error parsing JSON:', error)
    //         //     }
    //         // })
    //         // rl.on('close', () => {
    //         //     console.log('Finished reading the JSONL file.');
    //         // })
    //     }
    //     // console.log('asfa',dataArray)
    //     return null
    // } catch (error) {
    //     console.log('errr', error)
    //     return error
    // }
    return json({ data: 'Action data', status: true })

}


export const loader = async () => {

    // let res = await fetch('http://localhost:3000/temp', { method: "post" })
    // // res = await res.json()
    // // console.log('htsdhas',fileUploadHandler(filess).then((res)))
    // console.log('ress---------', res)

    // let data = [
    //     { input: { title: 'a', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'b', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'c', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'd', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'z', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'x', productType: 'test', vendor: 'Alphaa' } },
    //     { input: { title: 'c', productType: 'test', vendor: 'Alphaa' } }
    // ]
    // let url = 'https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/trlo23avftz3c78wdlck51kd0wf5?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1699422028&Signature=Pbb6f8TMfZ2BDDHFXNhL3KMuqo2MsMnhKoA9kBHcxlIB55A8f6EsrF5gKeV6YbQ19D7GGfN9tLtnaBK7iQALpXK4BEiflngV9mXh4VuNdna24XLupYPDElsPfGKIpoKOZj6FvmYPyNLfnQqhEmpycrgFfmr5%2F2fkJRu264kwBe1kV5uxCJWfAZ8mQDHg%2BvckaeCAKuHv5ZraONJK0dX4kb0214qLYaOdtUp4t1mPzOMmK55GucaZCn5fbG9Zq3QvSr%2FoKKGqOxVocUIw3jGBoaBxXWFpF23t5cTsJbA65NpTjT2SJMDi3m3WY8%2FuJad8X7f1fiF6NUSNk0SI7JZ7rw%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3604442612005.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3604442612005.jsonl&response-content-type=application%2Fjsonl'

    // let jsonlfile = 'Bulkjson.jsonl'
    // let FinalJson = []
    // let response = await axios.get(url, { responseType: 'stream' })
    // if (response.status === 200) {

    //     const fileStream = fs.createWriteStream(jsonlfile)
    //     response.data.pipe(fileStream)
    //     // const stream = response.data

    //     const lineStream = byline(fs.createReadStream(jsonlfile));
    //     let dt = 0
    //     let dataArray = []

    //     lineStream.on('data', (line) => {
    //         // Parse each line as a JSON object
    //         const jsonObject = JSON.parse(line.toString());
    //         console.log('dss', line.toString())
    //         dataArray.push(jsonObject.data.productCreate); // Add the object to the array

    //         console.log('Line:', jsonObject);
    //         // fileData += line.toString() + '\n';
    //     });

    //     lineStream.on('end', () => {
    //         console.log('Finished reading the file.');
    //         console.log('File Data:', dataArray)
    //     })


    //     // console.log('adad', dt)
    //     // const rl = readLine.createInterface({
    //     //     input: stream,
    //     //     crlfDelay: Infinity,
    //     // })
    //     // rl.on('line', (line) => {
    //     //     try {
    //     //         const jsobject = JSON.parse(line)
    //     //         console.log('parse', jsobject)

    //     //     } catch (error) {
    //     //         console.error('Error parsing JSON:', error)
    //     //     }
    //     // })
    //     // rl.on('close', () => {
    //     //     console.log('Finished reading the JSONL file.');
    //     // })
    // }
    //     // const fileStream = fs.createWriteStream(jsonlfile);

    //     // console.log('jsonl', fileStream)
    //     // response.data.pipe(fileStream);

    //     // response.data.on('end', () => {
    //     //     console.log('JSONL file downloaded and saved.');
    //     //     readJSONLFile(jsonlfile); // Call the function to read the file
    //     // });
    // } catch (error) {
    //     console.log('error file downloading', error)
    // }

    // console.log('result', result)












    // let jsondata = data.map(obj => JSON.stringify(obj)).join('\n')
    // console.log('json data', jsondata)

    // const form = new FormData()
    // const filename = 'data.jsonl'


    // const blob = new Blob([jsondata])
    // const jsFile = new File([blob], "myjsonn.jsonl",{type: 'application/jsonl'})

    // fs.writeFileSync(filename, jsondata)
    // form.append('csvfile', jsFile)

    // console.log('sffs', form)

    // let res = await fetch('http://localhost:3000/upload', { method: "post", body: form })
    // // res = await res.json()
    // console.log('res', res)

    return null

}

// async function readJSONLFile(lineStream) {
//     let dataArray = []

//     lineStream.on('data', (line) => {
//         try {
//             // Parse each line as a JSON object
//             const jsonObject = JSON.parse(line.toString());
//             console.log('dss', line.toString())
//             dataArray.push(jsonObject.data.productCreate);
//             // FinalJson.push(jsonObject.data.productCreate) // Add the object to the array

//             // console.log('Line:', jsonObject);
//             console.log('Line:', dataArray);
//             // fileData += line.toString() + '\n';
//         } catch (error) {
//             console.log('dsfsd', error)
//         }
//     })
//     // lineStream.on('data', (line) => {
//     //     // Parse each line as a JSON object
//     //     const jsonObject = JSON.parse(line.toString());
//     //     console.log('dss', line.toString())
//     //     dataArray.push(jsonObject.data.productCreate);
//     //     // FinalJson.push(jsonObject.data.productCreate) // Add the object to the array

//     //     console.log('Line:', jsonObject);
//     //     console.log('Line:', dataArray);
//     //     // fileData += line.toString() + '\n';
//     // });

//     lineStream.on('end', async () => {
//         console.log('Finished reading the file.');
//         console.log('File Data:', dataArray)
//         return dataArray
//         // processArray(dataArray);
//     })
// }


const Temp = () => {
    const Action_res = useActionData()
    const [msg, setMsg] = useState(false)
    const [errmsg, seterrMsg] = useState(false)

    const datasjj = () => {
        let url = 'https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/trlo23avftz3c78wdlck51kd0wf5?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1699422028&Signature=Pbb6f8TMfZ2BDDHFXNhL3KMuqo2MsMnhKoA9kBHcxlIB55A8f6EsrF5gKeV6YbQ19D7GGfN9tLtnaBK7iQALpXK4BEiflngV9mXh4VuNdna24XLupYPDElsPfGKIpoKOZj6FvmYPyNLfnQqhEmpycrgFfmr5%2F2fkJRu264kwBe1kV5uxCJWfAZ8mQDHg%2BvckaeCAKuHv5ZraONJK0dX4kb0214qLYaOdtUp4t1mPzOMmK55GucaZCn5fbG9Zq3QvSr%2FoKKGqOxVocUIw3jGBoaBxXWFpF23t5cTsJbA65NpTjT2SJMDi3m3WY8%2FuJad8X7f1fiF6NUSNk0SI7JZ7rw%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3604442612005.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3604442612005.jsonl&response-content-type=application%2Fjsonl'

    }
    useEffect(() => {
        if (Action_res) {
            console.log('action', Action_res)
            console.log('ac', Action_res.status)
        }
    }, [Action_res])

    return (
        <Page title='Temprory'>
            <Frame>
                <Card>
                    <p>testing</p>
                    <Form method='post'>
                        <button type='submit'>Test</button>
                    </Form>
                </Card>
                {msg ? <Toast onDismiss={() => setMsg(false)} content={'Customer Updateded...  '} duration={4000}></Toast> : null}
                {errmsg ? <Toast onDismiss={() => seterrMsg(false)} content={'Somthing went wrong  '} duration={3000} error></Toast> : null} 
            </Frame>
        </Page>

    )
}

export default Temp