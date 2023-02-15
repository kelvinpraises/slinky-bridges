import { kRadiusL } from "@/data/borderRadius";
import { BridgeBlockType } from "@/data/config";
import ellipsisAddress from "@/utils/ellipsisAddress";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { keyframes, styled } from "styled-components";

interface IConnectWallet {
  disconnect(): any;
  connected: boolean;
  pk: string;
  bridgeBlockType: BridgeBlockType;
  children: any;
}

const ConnectWalletToggle = ({
  disconnect,
  connected,
  pk,
  bridgeBlockType,
  children,
}: IConnectWallet) => {
  return connected ? (
    <SButton onClick={disconnect}>Disconnect {ellipsisAddress(pk)}</SButton>
  ) : (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <SButton>CONNECT WALLET</SButton>
      </Dialog.Trigger>

      <Dialog.Portal>
        <SDialogOverlay>
          <SDialogContent>
            <SDialogTitle>Connect wallet</SDialogTitle>
            <SDialogDescription>
              {bridgeBlockType === BridgeBlockType.ORIGIN
                ? "Select a wallet holding the token you wish to bridge."
                : "Select a wallet to receive your bridged token."}
            </SDialogDescription>

            {children}

            <Dialog.Close asChild>
              <SIconButton>
                <Cross2Icon />
              </SIconButton>
            </Dialog.Close>
          </SDialogContent>
        </SDialogOverlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConnectWalletToggle;

const overlayShow = keyframes` 
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const contentShow = keyframes`
  from {
    opacity: 0;
    transform:  scale(0.96);
  }
  to {
    opacity: 1;
    transform:  scale(1);
  }
`;

const SDialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2;
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
`;

const SDialogContent = styled(Dialog.Content)`
  position: relative;
  background-color: white;
  border-radius: 6px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  width: 90vw;
  max-width: 300px;
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
  background: white;
  padding: 30px;
  border-radius: 4px;
`;

const SDialogTitle = styled(Dialog.Title)`
  margin: 0;
  font-weight: 500;
  font-size: 17px;
`;

const SDialogDescription = styled(Dialog.Description)`
  margin: 10px 0 20px;
  font-size: 15px;
  line-height: 1.5;
`;

const SButton = styled.button`
  all: unset;
  cursor: pointer;
  display: grid;
  place-items: center;
  border-radius: ${kRadiusL};
  color: #ffffff;
  height: 2rem;
  font-weight: 600;
  line-height: 20px;
  font-size: 0.9rem;
  text-align: center;
  transition: all 200ms ease;
  padding: 10px 22px;
  user-select: none;
  background-color: #eb006c;
  margin-bottom: 1rem;

  &:focus {
    border-color: #eb006c;
    box-shadow: 0 0 0 3px #bc8f9c7f;
  }

  &:hover {
    background-color: #f42282;
  }

  &:active {
    background-color: #c6005b;
  }

  &:disabled {
    background-color: #eb006c;
    opacity: 0.7;
    cursor: default;
  }
`;
const SIconButton = styled(SButton)`
  all: unset;
  border-radius: 100%;
  height: 25px;
  width: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: black;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const SFieldset = styled.fieldset`
  all: unset;
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 15px;
`;

const SLabel = styled.label`
  font-size: 15px;
  color: black;
  width: 90px;
  text-align: right;
`;

const SInput = styled.input`
  all: unset;
  width: 100%;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 10px;
  font-size: 15px;
  line-height: 1;
  color: green;
  box-shadow: 0 0 0 1px green;
  height: 35px;

  &:focus {
    box-shadow: 0 0 0 2px green;
  }
`;

// Scroll Area

const SScrollAreaRoot = styled(ScrollArea.Root)`
  position: fixed !important;
  height: 225px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 10px var(--blackA7);
  background-color: #c4ffed;
  --scrollbar-size: 10px;
`;

const SScrollAreaViewport = styled(ScrollArea.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`;

const SScrollAreaScrollbar = styled(ScrollArea.Scrollbar)`
  display: flex;
  user-select: none;
  touch-action: none;
  padding: 2px;
  background: #9c9c9ca6;
  transition: background 160ms ease-out;

  &:hover {
    background: black;
  }

  &[data-orientation="vertical"] {
    width: var(--scrollbar-size);
  }

  &[data-orientation="horizontal"] {
    flex-direction: column;
    height: var(--scrollbar-size);
  }
`;

const SScrollAreaThumb = styled(ScrollArea.Thumb)`
  flex: 1;
  background: green;
  border-radius: var(--scrollbar-size);
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    min-width: 44px;
    min-height: 44px;
  }
`;

const SScrollAreaCorner = styled(ScrollArea.Corner)`
  background: #2c2c2c;
`;

const SText = styled.div`
  color: red;
  font-size: 15px;
  line-height: 18px;
  font-weight: 500;
`;

const SWallet = styled.div`
  color: green;
  font-size: 13px;
  line-height: 18px;
  margin-top: 10px;
  border-top: 1px solid green;
  padding-top: 10px;
`;
