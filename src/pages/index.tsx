/* eslint-disable no-console */
/* eslint-disable simple-import-sort/imports */
/* eslint-disable unused-imports/no-unused-imports */
import React, { useState } from 'react';
import type { NextPage } from 'next';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import { Connection, PublicKey } from '@solana/web3.js';
import fetch from 'isomorphic-fetch';
import { Jupiter, RouteInfo, TOKEN_LIST_URL } from '@jup-ag/core';

import {
  ENV,
  INPUT_MINT_ADDRESS,
  OUTPUT_MINT_ADDRESS,
  SOLANA_RPC_ENDPOINT,
  Token,
  USER_KEYPAIR,
} from '../constants';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import 'dotenv/config';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Vercel from '~/svg/Vercel.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
interface Props {
  userAgent?: string;
  SOLANA_RPC_ENDPOINT?: undefined;
  TOKEN_LIST_URL?: undefined;
  ENV?: undefined;
  tokens?: Token;
  USER_KEYPAIR?: undefined;
  INPUT_MINT_ADDRESS?: undefined;
  OUTPUT_MINT_ADDRESS?: undefined;
}
const main = async () => {
  try {
    const connection = new Connection(SOLANA_RPC_ENDPOINT);
    const tokens: Token[] = await (await fetch(TOKEN_LIST_URL[ENV])).json();

    const jupiter = await Jupiter.load({
      connection,
      cluster: ENV,
      user: USER_KEYPAIR, // or public key
      // platformFeeAndAccounts:  NO_PLATFORM_FEE,
      // routeCacheDuration: CACHE_DURATION_MS
    });
    console.log(jupiter);

    const routeMap: Map<string, string[]> = jupiter.getRouteMap();
    const inputToken = tokens.find((t) => t.address == INPUT_MINT_ADDRESS);
    const outputToken = tokens.find((t) => t.address == OUTPUT_MINT_ADDRESS);
    console.log(inputToken);
    console.log(outputToken);
    console.log(routeMap);
  } catch (error) {
    console.log(error);
  }
};
main();

const Home: NextPage<Props> = ({ userAgent }) => {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <Vercel className='text-5xl' />
            <h1 className='mt-4'>Lagrange.fi</h1>
            <p className='mt-2 text-sm text-gray-800'>
              Your user agent: {userAgent}
            </p>

            <p className='mt-2 text-sm text-gray-700'>
              <ArrowLink href='https://github.com/theodorusclarence/ts-nextjs-tailwind-starter'>
                See the repository
              </ArrowLink>
            </p>

            <ButtonLink className='mt-6' href='/components' variant='light'>
              See all components
            </ButtonLink>

            <UnstyledLink
              href='https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fts-nextjs-tailwind-starter'
              className='mt-4'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                width='92'
                height='32'
                src='https://vercel.com/button'
                alt='Deploy with Vercel'
              />
            </UnstyledLink>

            <footer className='absolute bottom-2 text-gray-700'>
              © {new Date().getFullYear()} By{' '}
              <UnderlineLink href='https://theodorusclarence.com?ref=tsnextstarter'>
                Theodorus Clarence
              </UnderlineLink>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
};

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Home;
