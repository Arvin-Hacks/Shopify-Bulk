import { useActionData, useSubmit } from "@remix-run/react";
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
const token = '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'
const url = 'https://AlphaaaStore.myshopify.com/admin/api/2023-10/products.json'

export const action = async () => {

  const product = {
    title: "1jaxck",
    vendor: 'sparrow'
  }

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





export default function AdditionalPage() {

  const actiondata = useActionData()
  const submit = useSubmit()

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
