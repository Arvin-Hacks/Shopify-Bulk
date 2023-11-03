import { useEffect } from "react";
import { json } from "@remix-run/node";
import { Link, useActionData, useLoaderData, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { Button, Card, Frame, Page, Text, } from "@shopify/polaris";
import { authenticate } from "../shopify.server";

const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/graphql.json'
const token = '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'
const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }

export const loader = async ({ request }) => {
  // await authenticate.admin(request);
  // let url = "https://storage.googleapis.com/shopify-tiers-assets-prod-us-east1/0lp31nbswdia0ix0kaame1gftwuz?GoogleAccessId=assets-us-prod%40shopify-tiers.iam.gserviceaccount.com&Expires=1699358043&Signature=l6%2FbmtPrYuQC15%2BUI0SlQfVori8Z63uyzBBa5J0Rm2RQiRk9MtgIR%2FohFNCjfm5MTe442c5jfD7jr%2FbhZp%2Bs6reDF5l%2BR2wcpXSiq4%2FOHjd221%2FxhRvIQeZnwIctLsXt7kHTw%2FjmgqgUPebkAztiRP3O%2BSiqUDcxSE6bzXat%2F9OG7E0PXwR5OAI7DWa0WYjb5Kl7WAPre9RrSGszCYEfsKwi7NlC9fY5gkDZZ%2FNQ%2BHWJhhH8XuexZ4a%2BrnH1wAchWjiEKYw6LcvC2VPs8Ds2fuswm6dyHgbn9mC9AdyMT4%2BCgG42Uwg6eT17Q%2FCZ2%2FIkENUTu4JD8jvQWeTUQsaQBw%3D%3D&response-content-disposition=attachment%3B+filename%3D%22bulk-3602315477285.jsonl%22%3B+filename%2A%3DUTF-8%27%27bulk-3602315477285.jsonl&response-content-type=application%2Fjsonl"

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
    // console.log('Result', result)
    
    return json({ data: result, status: true })

  } catch (error) {
    // console.log('error', error)
    return json({ data: error, status: false })
  }


  // let result=await fetch('http://localhost:3000/',{method:'post'})
  // result=await result.json()

  // return result;
  return null
};

export const action = async ({ request }) => {
  return null
};

export default function Index() {
  // const nav = useNavigation();
  const Navigate = useNavigate()
  // const actionData = useActionData();
  const loader = useLoaderData()
  // const submit = useSubmit();

  // // useEffect(() => {
  // //   if(actionData){
  // //     console.log('action dataa',actionData)
  // //   }
  // // }, [actionData]);
  // console.log('app data', loader)
  // console.warn('action data', loader.status)

  return (
    <Page title="">
      <ui-title-bar title="Dashboard">

      </ui-title-bar>

      <Frame>
        <Card>
          <div style={{ display: "flex", }}>
            <div style={{ width: '300px', height: '200px', border: '1px solid gray' }}>
              <Text as="h3">Current Bulk Upload Status</Text>

              {loader.status ? loader.data.data.currentBulkOperation.status : 'no data'}
              {/* <p>{console.log('st',loader.data.data.currentBulkOperation.status)}</p> */}
            </div>
            <div style={{ marginLeft: '20px' }} >
              {/* <Link to="/app/bulkUpload">Bulk upload</Link> */}
              <Button pressed onClick={() => Navigate('/app/bulkUpload')}>Bulk import</Button>
            </div>
          </div>
        </Card>
      </Frame>

    </Page>
  );
}
