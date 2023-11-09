import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { json } from "@remix-run/node";
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
} from "@shopify/polaris";
import { useEffect } from "react";
const token = 'shpua_9fcfa40536b3870e6febc04f75e88441'
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/products.json'
import { BulkImportEntry } from '../api/DBquery.server'

// console.log('evn data',process.env.SHOP_TOKEN)
export const action = async () => {

  const product = {
    title: "1jaxck",
    vendor: 'sparrow'
  }
  console.log('xfgjhkgfgd')
  try {
    const header = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' }
    let result = await fetch(url, { method: 'post', headers: header, body: JSON.stringify({ product: product }) })
    result = await result.json()
    console.log('ressult...', result)
    return json({ data: 'Product Added', status: true })
    // return result

  } catch (error) {
    console.log('first error', error)
    return json({ false: false, data: 'Something went wrong' })
  }

  return null
}

export const loader = async () => {
  // try {
  //   let result = await BulkImportEntry()
  //   console.log('res', result)
  //   return json({ data: result, status: true })
  // } catch (error) {
  //   console.log('result', error)
  //   return json({ error: "Something went Wrong", status: false })
  // }
  return null
}




export default function AdditionalPage() {

  const actiondata = useActionData()
  const loader=useLoaderData()
  const submit = useSubmit()

  console.warn('loader',loader)
  useEffect(() => {
    if (actiondata) {
      console.log('action', actiondata)
    }
  }, [actiondata])
  return (
    <Page>
      <ui-title-bar title="Additional page" />
      <Layout>
        <Button onClick={() => submit({ id: '123' }, { method: "POST" })}>
          ADD PRODUCT
        </Button>
        <Button>sdfjhfgv</Button>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
