import { writeFile } from "fs/promises";
import path from "path";

type OptionsGenerateAvatars = {
  outputPath: string;
  catalystBaseUrl: string;
  faceWidth: number;
  faceHeight: number;
  width: number;
  height: number;
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

function splitUrnAndTokenId(urnReceived: string) {
  const urnLength = urnReceived.split(":").length;

  if (urnLength === 7) {
    const lastColonIndex = urnReceived.lastIndexOf(":");
    const urnValue = urnReceived.slice(0, lastColonIndex);
    return { urn: urnValue, tokenId: urnReceived.slice(lastColonIndex + 1) };
  } else {
    return { urn: urnReceived, tokenId: undefined };
  }
}

function profileWithAssetUrns(profile: any) {
  return {
    ...profile,
    metadata: {
      ...profile.metadata,
      avatars: profile.metadata.avatars.map((av: any) => ({
        ...av,
        avatar: {
          ...av.avatar,
          wearables: av.avatar.wearables.map(
            (wearable: any) => splitUrnAndTokenId(wearable).urn,
          ),
        },
      })),
    },
  };
}

async function preparePayload(
  entity: string,
  options: OptionsGenerateAvatars,
): Promise<GodotAvatarPayload> {
  const response = await fetch(
    `${options.catalystBaseUrl}/content/contents/${entity}`,
  );
  const data = await response.json();
  const destPath = path.join(options.outputPath, `${entity}.png`);
  const faceDestPath = path.join(options.outputPath, `${entity}_face.png`);

  return {
    destPath,
    faceDestPath,
    width: options.width,
    height: options.height,
    faceWidth: options.faceWidth,
    faceHeight: options.faceHeight,
    avatar: profileWithAssetUrns(data).metadata.avatars[0].avatar,
  };
}

export async function main(): Promise<void> {
  const options = {
    catalystBaseUrl: `https://peer.decentraland.org`,
    outputPath: "output",
    width: 256,
    height: 512,
    faceWidth: 256,
    faceHeight: 256,
  };

  const entity = process.argv[2];
  const output = {
    baseUrl: `${options.catalystBaseUrl}/content`,
    payload: [await preparePayload(entity, options)],
  };
  const avatarDataPath = `avatars.json`;
  await writeFile(avatarDataPath, JSON.stringify(output));
}

main().catch(console.log);
