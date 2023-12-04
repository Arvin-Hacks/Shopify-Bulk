import { json } from "@remix-run/node";
import React, { useCallback, useState } from 'react'
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { authenticate } from "../shopify.server";
import { Button, LegacyCard, Tabs } from "@shopify/polaris";

import Appcss from '../../app.css'

export const links = () => [{ rel: "stylesheet", href: polarisStyles }, { rel: "stylesheet", href: Appcss }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  let admin = await authenticate.admin(request)
  const auth = admin?.session?.accessToken
  // console.log('responsee', url)

  return json({ apiKey: process.env.SHOPIFY_API_KEY || "", accessToken: auth });
};

export default function App() {
  const { apiKey } = useLoaderData();
const tabs = [
    {
      id: 'Dashboard',
      content: <Link to={'/app'} style={{ textDecoration: "none", color: '#000000' }}>Dashboard</Link>,
      panelID: 'Dashboard',
    },
    {
      id: 'Products',
      content: <Link to={'/app/product'} style={{ textDecoration: "none", color: '#000000' }}>Products</Link>,
      panelID: 'Products',
    },
    {
      id: 'Bulk Import',
      content: <Link to={'/app/bulkUpload'} style={{ textDecoration: "none", color: '#000000' }}>Bulk Import</Link>,
      panelID: 'Bulk Import',
      // action: console.log('order')
    },
  ];
  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  const [selected, setSelected] = useState(0)

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey} >
      <ui-nav-menu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/product">Product Page</Link>
        <Link to="/app/additional">Additional page</Link>
        <Link to="/app/testt">Test page</Link>
      </ui-nav-menu>

      <Tabs
        // @ts-ignore
        tabs={tabs} selected={selected} onSelect={handleTabChange}>

      </Tabs>
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
