const getSolanaParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  const connection = new Connection(SOLANA_HOST, "confirmed");
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    //No matter what, we retrieve the spl tokens associated to this address.
    let splParsedTokenAccounts = await connection
      .getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
      })
      .then((result) => {
        return result.value.map((item) =>
          createParsedTokenAccountFromInfo(item.pubkey, item.account)
        );
      });

    // uncomment to test token account in picker, useful for debugging
    // splParsedTokenAccounts.push({
    //   amount: "1",
    //   decimals: 8,
    //   mintKey: "2Xf2yAXJfg82sWwdLUo2x9mZXy6JCdszdMZkcF1Hf4KV",
    //   publicKey: "2Xf2yAXJfg82sWwdLUo2x9mZXy6JCdszdMZkcF1Hf4KV",
    //   uiAmount: 1,
    //   uiAmountString: "1",
    //   isNativeAsset: false,
    // });

    if (nft) {
      //In the case of NFTs, we are done, and we set the accounts in redux
      dispatch(receiveSourceParsedTokenAccountsNFT(splParsedTokenAccounts));
    } else {
      //In the transfer case, we also pull the SOL balance of the wallet, and prepend it at the beginning of the list.
      const nativeAccount = await createNativeSolParsedTokenAccount(
        connection,
        walletAddress
      );
      if (nativeAccount !== null) {
        splParsedTokenAccounts.unshift(nativeAccount);
      }
      dispatch(receiveSourceParsedTokenAccounts(splParsedTokenAccounts));
    }
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};

const createNativeSolParsedTokenAccount = async (
  connection: Connection,
  walletAddress: string
) => {
  // const walletAddress = "H69q3Q8E74xm7swmMQpsJLVp2Q9JuBwBbxraAMX5Drzm" // known solana mainnet wallet with tokens
  const fetchAccounts = await getMultipleAccountsRPC(connection, [
    new PublicKey(walletAddress),
  ]);
  if (!fetchAccounts || !fetchAccounts.length || !fetchAccounts[0]) {
    return null;
  } else {
    return createParsedTokenAccount(
      walletAddress, //publicKey
      WSOL_ADDRESS, //Mint key
      fetchAccounts[0].lamports.toString(), //amount
      WSOL_DECIMALS, //decimals, 9
      parseFloat(formatUnits(fetchAccounts[0].lamports, WSOL_DECIMALS)),
      formatUnits(fetchAccounts[0].lamports, WSOL_DECIMALS).toString(),
      "SOL",
      "Solana",
      undefined, //TODO logo. It's in the solana token map, so we could potentially use that URL.
      true
    );
  }
};

const getAlgorandParsedTokenAccounts = async (
  walletAddress: string,
  dispatch: Dispatch,
  nft: boolean
) => {
  dispatch(
    nft ? fetchSourceParsedTokenAccountsNFT() : fetchSourceParsedTokenAccounts()
  );
  try {
    const algodClient = new Algodv2(
      ALGORAND_HOST.algodToken,
      ALGORAND_HOST.algodServer,
      ALGORAND_HOST.algodPort
    );
    const accountInfo = await algodClient
      .accountInformation(walletAddress)
      .do();
    const parsedTokenAccounts: ParsedTokenAccount[] = [];
    for (const asset of accountInfo.assets) {
      const assetId = asset["asset-id"];
      const amount = asset.amount;
      const metadata = await fetchSingleMetadata(assetId, algodClient);
      const isNFT: boolean = amount === 1 && metadata.decimals === 0;
      if (((nft && isNFT) || (!nft && !isNFT)) && amount > 0) {
        parsedTokenAccounts.push(
          createParsedTokenAccount(
            walletAddress,
            assetId.toString(),
            amount,
            metadata.decimals,
            parseFloat(formatUnits(amount, metadata.decimals)),
            formatUnits(amount, metadata.decimals).toString(),
            metadata.symbol,
            metadata.tokenName,
            undefined,
            false
          )
        );
      }
    }
    if (nft) {
      dispatch(receiveSourceParsedTokenAccountsNFT(parsedTokenAccounts));
      return;
    }
    // The ALGOs account is prepended for the non NFT case
    parsedTokenAccounts.unshift(
      createParsedTokenAccount(
        walletAddress, //publicKey
        "0", //asset ID
        accountInfo.amount, //amount
        ALGO_DECIMALS,
        parseFloat(formatUnits(accountInfo.amount, ALGO_DECIMALS)),
        formatUnits(accountInfo.amount, ALGO_DECIMALS).toString(),
        "ALGO",
        "Algo",
        undefined, //TODO logo
        true
      )
    );
    dispatch(receiveSourceParsedTokenAccounts(parsedTokenAccounts));
  } catch (e) {
    console.error(e);
    dispatch(
      nft
        ? errorSourceParsedTokenAccountsNFT("Failed to load NFT metadata")
        : errorSourceParsedTokenAccounts("Failed to load token metadata.")
    );
  }
};
