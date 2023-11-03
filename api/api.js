import axios from "axios"
// import ngrok from "ngrok"
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/graphql.json'
const webhookurl = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/webhooks.json'
const token = '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'
const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }

// export const getCallbackurl = async () => {
//   let data = await ngrok.connect(3000)
//   console.log('getCallbackurl', data)
//   return null
// }

export const Bulkstageupload = async () => {

  try {
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
    return api_1

  } catch (error) {
    console.log('error', error)
    return error
  }

}

export const BulkDataupload = async (data) => {

  console.log('sdfsjhcfs', data)

  try {
    let config = {
      method: 'post',
      url: 'https://shopify-staged-uploads.storage.googleapis.com/',
      data: data
    }
    let api_2 = await axios(config)
    console.log('api_2', api_2)
    return api_2

  } catch (error) {
    console.log('error', error)
    return error
  }


}

export const BulkOperationRunMutation = async (key) => {

  try {
    const graphql = JSON.stringify({
      query: `mutation {
          bulkOperationRunMutation(
            mutation: "mutation call($input: ProductInput!) { productCreate(input: $input) { product {id title variants(first: 10) {edges {node {id title inventoryQuantity }}}} userErrors { message field } } }",
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
        }
        `,
      variables: {}
    })

    let result = await fetch(url, { method: 'post', body: graphql, headers: header })
    result = await result.json()
    console.log('step3', result)
    return result

  } catch (error) {
    console.log('error', error)
    return error

  }

}

export const CurrentBulkOperation = async () => {
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

    return json({ data: result, status: true })

  } catch (error) {
    console.log('error', error)
    return json({ data: error, status: false })
  }
}

export const GenerateWebhook = async (cb_url) => {
  try {
    let graphql = JSON.stringify({
      query: `mutation {
          webhookSubscriptionCreate(
            topic: BULK_OPERATIONS_FINISH
            webhookSubscription: {
              format: JSON,
              callbackUrl: "${cb_url}/productcreatewebhook"}
          ) {
            userErrors {
              field
              message
            }
            webhookSubscription {
              id
            }
          }
        }
        `
    })

    let result = await fetch(url, { method: 'post', body: graphql, headers: header })
    result = await result.json()
    console.log('webhook', result)
    return result

  } catch (error) {
    console.log('error', error)
    return error
  }

}

export const ProductGenerateWebhook = async (cb_url) => {
  try {
    let graphql = {
      "webhook": {
        "address": cb_url + '/productcreatewebhook',
        "topic": "products/create",
        "format": "json"
      }
    }

    let result = await fetch(webhookurl, { method: 'post', body: JSON.stringify(graphql), headers: header })
    result = await result.json()
    console.log('webhook', result)
    return result

  } catch (error) {
    console.log('error', error)
    return error
  }

}




