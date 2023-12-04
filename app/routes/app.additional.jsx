import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";

export const loader = async ({ request }) => {

  const shopUrl = new URL(request.url);
  const ShopUrl = request.headers
  let url = shopUrl.searchParams.get("shop");

 
  return null
};

export default function AdditionalPage() {
  return (
    <Page title="Additional page">
      <Card>
        <Text as="h2" variant="headingMd">
          Additional page
        </Text>
      </Card>

    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="1"
      paddingInlineEnd="1"
      background="bg-subdued"
      borderWidth="1"
      borderColor="border"
      borderRadius="1"
    >
      <code>{children}</code>
    </Box>
  );
}
