import { Connection, PublicKey } from "@solana/web3.js";
import { SOLANA_HOST } from "../utils/consts";
import { createParsedTokenAccount } from "../utils/parsedTokenAccount";

export async function getSolanaTokenAccount(
  targetAsset: string,
  solPK: PublicKey
) {
  let mint;
  try {
    mint = new PublicKey(targetAsset);
  } catch (e) {
    return;
  }
  const connection = new Connection(SOLANA_HOST, "confirmed");
  const { value } = await connection.getParsedTokenAccountsByOwner(solPK, {
    mint,
  });

  if (value.length) {
    return createParsedTokenAccount(
      value[0].pubkey.toString(),
      value[0].account.data.parsed?.info?.mint,
      value[0].account.data.parsed?.info?.tokenAmount?.amount,
      value[0].account.data.parsed?.info?.tokenAmount?.decimals,
      value[0].account.data.parsed?.info?.tokenAmount?.uiAmount,
      value[0].account.data.parsed?.info?.tokenAmount?.uiAmountString
    );
  } else {
    // TODO: error state
  }
}

// if (
//   isEVMChain(targetChain) &&
//   provider &&
//   signerAddress &&
//   hasCorrectEvmNetwork
// ) {
//   const token = ethers_contracts.TokenImplementation__factory.connect(
//     targetAsset,
//     provider
//   );
//   token
//     .decimals()
//     .then((decimals) => {
//       token.balanceOf(signerAddress).then((n) => {
//         if (!cancelled) {
//           dispatch(
//             setTargetParsedTokenAccount(
//               // TODO: verify accuracy
//               createParsedTokenAccount(
//                 signerAddress,
//                 token.address,
//                 n.toString(),
//                 decimals,
//                 Number(formatUnits(n, decimals)),
//                 formatUnits(n, decimals),
//                 symbol,
//                 tokenName,
//                 logo
//               )
//             )
//           );
//         }
//       });
//     })
//     .catch(() => {
//       if (!cancelled) {
//         // TODO: error state
//       }
//     });
// }

// if (
//   targetChain === CHAIN_ID_ALGORAND &&
//   algoAccounts[0] &&
//   decimals !== undefined
// ) {
//   const algodClient = new Algodv2(
//     ALGORAND_HOST.algodToken,
//     ALGORAND_HOST.algodServer,
//     ALGORAND_HOST.algodPort
//   );
//   try {
//     const tokenId = BigInt(targetAsset);
//     algodClient
//       .accountInformation(algoAccounts[0].address)
//       .do()
//       .then((accountInfo) => {
//         let balance = 0;
//         if (tokenId === BigInt(0)) {
//           balance = accountInfo.amount;
//         } else {
//           let ret = 0;
//           const assets: Array<any> = accountInfo.assets;
//           assets.forEach((asset) => {
//             if (tokenId === BigInt(asset["asset-id"])) {
//               ret = asset.amount;
//               return;
//             }
//           });
//           balance = ret;
//         }
//         dispatch(
//           setTargetParsedTokenAccount(
//             createParsedTokenAccount(
//               algoAccounts[0].address,
//               targetAsset,
//               balance.toString(),
//               decimals,
//               Number(formatUnits(balance, decimals)),
//               formatUnits(balance, decimals),
//               symbol,
//               tokenName,
//               logo
//             )
//           )
//         );
//       })
//       .catch(() => {
//         if (!cancelled) {
//           // TODO: error state
//         }
//       });
//   } catch (e) {
//     if (!cancelled) {
//       // TODO: error state
//     }
//   }
// }
