import { exec } from "child_process";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync, rmSync } from "fs";
import path from "path";

let executionNumber = 0;

type OptionsGenerateAvatars = Partial<{
  outputPath: string;
  catalystBaseUrl: string;
  face: boolean;
  faceWidth: number;
  faceHeight: number;
  width: number;
  height: number;
}>;

type AvatarGenerationResult = {
  avatarPath: string;
  facePath: string | undefined;
};

type GodotAvatarPayload = {
  destPath: string;
  width: number | undefined;
  height: number | undefined;
  faceDestPath: string | undefined;
  faceWidth: number | undefined;
  faceHeight: number | undefined;
  avatar: any;
};

async function preparePayload(
  entity: string,
  options: OptionsGenerateAvatars,
): Promise<GodotAvatarPayload> {
  const response = await fetch(
    `${options.catalystBaseUrl}/content/contents/${entity}`,
  );
  const data = await response.json();
  const destPath = path.join(options.outputPath ?? "", `${entity}.png`);
  const faceDestPath = options.face
    ? path.join(options.outputPath ?? "", `${entity}_face.png`)
    : undefined;
  return {
    destPath,
    width: options.width,
    height: options.height,
    faceDestPath,
    faceWidth: options.faceWidth,
    faceHeight: options.faceHeight,
    avatar: data.metadata,
  };
}

export async function main(): Promise<void> {
  // default values
  const options = {
    catalystBaseUrl: `https://peer.decentraland.org`,
    outputPath: "output",
    width: 256,
    height: 512,
    faceWidth: 256,
    faceHeight: 256,
  };

  const entity = "bafkreiagiqh6hej6dpr3shqsob54jcdec5mhbtrpvxnpi3dqovzsfmitke";

  const output = {
    baseUrl: `${options.catalystBaseUrl}/content`,
    payload: [await preparePayload(entity, options)],
  };
  const avatarDataPath = `avatars.json`;
  await writeFile(avatarDataPath, JSON.stringify(output));
}

main().catch(console.log);
