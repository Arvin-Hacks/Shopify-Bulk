const axios = require('axios')
const fs = require('fs')
const byline = require('byline')
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/graphql.json'
const token = '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'
const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }




module.exports.CurrentBulkOperation1 = async () => {
    try {
        const graphql = JSON.stringify({
            query: `query {
          currentBulkOperation(type: MUTATION) {
             id
             status
             errorCode
             createdAt
             completedAt
             objectCount
             fileSize
             url
             partialDataUrl
          }
         }
         `
        })

        let result = await fetch(url, { method: 'post', body: graphql, headers: header })
        result = await result.json()
        console.log('Result', result)
        return result

    } catch (error) {
        console.log('error', error)
        return error
    }
}


module.exports.GetBulkResponse = async () => {

    let url = 'https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/trlo23avftz3c78wdlck51kd0wf5?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1699422028&Signature=Pbb6f8TMfZ2BDDHFXNhL3KMuqo2MsMnhKoA9kBHcxlIB55A8f6EsrF5gKeV6YbQ19D7GGfN9tLtnaBK7iQALpXK4BEiflngV9mXh4VuNdna24XLupYPDElsPfGKIpoKOZj6FvmYPyNLfnQqhEmpycrgFfmr5%2F2fkJRu264kwBe1kV5uxCJWfAZ8mQDHg%2BvckaeCAKuHv5ZraONJK0dX4kb0214qLYaOdtUp4t1mPzOMmK55GucaZCn5fbG9Zq3QvSr%2FoKKGqOxVocUIw3jGBoaBxXWFpF23t5cTsJbA65NpTjT2SJMDi3m3WY8%2FuJad8X7f1fiF6NUSNk0SI7JZ7rw%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3604442612005.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3604442612005.jsonl&response-content-type=application%2Fjsonl'

    let jsonlfile = 'Bulkjson.jsonl'

    try {
        let response = await axios.get(url, { responseType: 'stream' })
        let dataArray = []
        if (response.status === 200) {

            const fileStream = fs.createWriteStream(jsonlfile)
            response.data.pipe(fileStream)
            // const stream = response.data

            const lineStream = byline(fs.createReadStream(jsonlfile));
            let dt = 0

            lineStream.on('data', (line) => {
                // Parse each line as a JSON object
                const jsonObject = JSON.parse(line.toString());
                console.log('dss', line.toString())
                dataArray.push(jsonObject.data.productCreate); // Add the object to the array
                console.log('Line:', jsonObject);
                // fileData += line.toString() + '\n';
            });

            lineStream.on('end', () => {
                console.log('Finished reading the file.');
                console.log('File Data:', dataArray)
                return dataArray
            })
        }
        console.log('aa', dataArray)
        return response

    } catch (error) {
        console.log('aa', error)
        return error
    }

}

// module.exports = CurrentBulkOperation1



// module.exports = GetBulkResponse
