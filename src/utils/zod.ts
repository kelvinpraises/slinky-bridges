import { NetworkType, TokenType } from "@/data/config";
import { z } from "zod";

const ZNetworkType = z.nativeEnum(NetworkType);
const ZTokenType = z.nativeEnum(TokenType);

const StateData = z.object({
  originNetworkType: ZNetworkType,
  originTokenType: ZTokenType,
  originTokenAmount: z.number().positive(),
  targetNetworkType: ZNetworkType,
  targetTokenType: ZTokenType,
  targetTokenAmount: z.any(),
});

export function validateStateData(inputs: unknown) {
  const isValidData = StateData.safeParse(inputs);
  return isValidData.success;
}
