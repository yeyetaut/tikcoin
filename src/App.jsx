import React, { useState } from 'react';
import {
  useSuiClient,
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

export default function App() {
  return (
    <div style={{ padding: 32, fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: 12 }}>Sui Transfer Demo</h2>
      <ConnectButton />
      <TransferSection />
    </div>
  );
}

function TransferSection() {
  const client = useSuiClient();                           // ✅ hook at top level
  const account = useCurrentAccount();                     // ✅ hook at top level
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');

  const recipient =
    '0xe87385c50b645c0ed1a53fb0561f35333d7c720451fa8ed88eb3927e87f4062a';
  
  const content_creator =
    '0x168ce75ac468bb9b440e1f9618369ececb1ec5d091282c69435df123a5c01358';

  const MYTOKEN_TYPE =
    '0x27b5e63baa29f67acf373f327257313c76026b2d5bdcc82fb4f2649aebb17ac7::tktc::TKTC';

  const buyPimPaw = async () => {
    if (!account) {
      alert('Connect your wallet first.');
      return;
    }

    // 🔍 Fetch your token objects
    const coins = await client.getCoins({
      owner: account.address,
      coinType: MYTOKEN_TYPE,
    });

    if (coins.data.length === 0) {
      alert('No coins available!');
      return;
    }

    const coinObjectId = coins.data[0].coinObjectId;

    // 🔨 Build transaction
    const tx = new Transaction();
    const [part] = tx.splitCoins(
    tx.object(coinObjectId),
    [tx.pure.u64(7*1000000000)]
    );
    tx.transferObjects([part], tx.pure.address(recipient));

    const [part2] = tx.splitCoins(
    tx.object(coinObjectId),
    [tx.pure.u64(3*1000000000)]
    );
    tx.transferObjects([part2], tx.pure.address(content_creator));

    // 🚀 Execute
    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: (res) => setDigest(res.digest),
        onError: (err) => alert(err?.message ?? String(err)),
      },
    );
  };
  const buyFingerHeart = async () => {
    if (!account) {
      alert('Connect your wallet first.');
      return;
    }

    // 🔍 Fetch your token objects
    const coins = await client.getCoins({
      owner: account.address,
      coinType: MYTOKEN_TYPE,
    });

    if (coins.data.length === 0) {
      alert('No coins available!');
      return;
    }

    const coinObjectId = coins.data[0].coinObjectId;

    // 🔨 Build transaction
    const tx = new Transaction();
    const [part] = tx.splitCoins(
    tx.object(coinObjectId),
    [tx.pure.u64(1*1000000000)]
    );
    tx.transferObjects([part], tx.pure.address(recipient));

    // 🚀 Execute
    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: (res) => setDigest(res.digest),
        onError: (err) => alert(err?.message ?? String(err)),
      },
    );
  };

  return (
    <div style={{ marginTop: 16 }}>
      {account ? (
        <>
          <button
            onClick={buyPimPaw}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            buy Pim Paw (10 tikcoins)
          </button>
          <button
            onClick={buyFingerHeart}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid #ddd',
              cursor: 'pointer',
            }}
          >
            buy Finger Heart (1 tikcoins)
          </button>
        </>
      ) : (
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          Connect your wallet to enable sending.
        </div>
      )}
    </div>
  );
}
