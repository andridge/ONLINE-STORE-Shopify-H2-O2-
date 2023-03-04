
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {defer} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/queries/cart';

import {ShopifyProvider} from '@shopify/hydrogen-react';
import tailwind from './styles/tailwind-build.css';
import styles from './styles/app.css';
import favicon from '../public/favicon.svg';
import { Layout } from './components/Layout';
const shopifyConfig = {
  storefrontToken: '3b580e70970c4528da70c98e097c2fa0',
  storeDomain: 'https://hydrogen-preview.myshopify.com',
  storefrontApiVersion: '2023-01',
  countryIsoCode: 'US',
  languageIsoCode: 'en',
};

export const links = () => {
  return [
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});


async function getCart({storefront}, cartId) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}


export async function loader({context}) {
  const cartId = await context.session.get('cartId');

  return defer({
    cart: cartId ? getCart(context, cartId) : undefined,
    layout: await context.storefront.query(LAYOUT_QUERY),
  });

}

export default function App() {
  const data = useLoaderData();

  const {name,description} = data.layout.shop;

  return (
    <ShopifyProvider {...shopifyConfig}>

    <html lang="en">
      <head>
  
        <Meta />
        <Links />
      </head>
      <body>
      <Layout title='OPENSEASONS'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </Layout>
      </body>
    </html>
    </ShopifyProvider>

  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }

`;
