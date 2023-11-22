import { exec } from "child_process";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync, rmSync } from "fs";
import path from "path";

let executionNumber = 0

type OptionsGenerateAvatars = Partial<{
  outputPath: string,
  catalystBaseUrl: string
  face: boolean,
  faceWidth: number,
  faceHeight: number,
  width: number,
  height: number,
}>

type AvatarGenerationResult = {
  avatarPath: string,
  facePath: string | undefined
}

type GodotAvatarPayload = {
  destPath: string,
  width: number | undefined,
  height: number | undefined,
  faceDestPath: string | undefined,
  faceWidth: number | undefined,
  faceHeight: number | undefined,
  avatar: any
}

async function preparePayload(address: string, options: OptionsGenerateAvatars): Promise<GodotAvatarPayload> {
  const response = await fetch(`${options.catalystBaseUrl}/lambdas/profiles/${address}`)
  const data = await response.json()
  const destPath = path.join(options.outputPath ?? '', `${address}.png`)
  const faceDestPath = options.face ? path.join(options.outputPath ?? '', `${address}_face.png`) : undefined
  return {
    destPath,
    width: options.width,
    height: options.height,
    faceDestPath,
    faceWidth: options.faceWidth,
    faceHeight: options.faceHeight,
    avatar: data.avatars[0].avatar
  }
}

export function generateAvatars(addresses: string[], _options?: OptionsGenerateAvatars): Promise<AvatarGenerationResult[]> {
  // default values
  const options = {
    ..._options,
    catalystBaseUrl: `https://peer.decentraland.org`
  }


  return new Promise(async (resolve, reject) => {
    // unique number for temp files
    executionNumber += 1

    // create directory if exists
    if (options.outputPath && !existsSync(options.outputPath)) {
      mkdirSync(options.outputPath)
    }

    const promises = addresses.map(address => preparePayload(address, options));
    const payloads: GodotAvatarPayload[] = await Promise.all(promises);

    const results: AvatarGenerationResult[] = payloads.map((payload) => {
      return {
        avatarPath: payload.destPath,
        facePath: payload.faceDestPath,
      }
    })

    const output = {
      baseUrl: `${options.catalystBaseUrl}/content`,
      payload: payloads
    }
    const avatarDataPath = `temp-avatars${executionNumber}.json`
    await writeFile(avatarDataPath, JSON.stringify(output))
    const explorerPath = process.env.EXPLORER_PATH || '.'
    const command = `
      DISPLAY=:99 ${explorerPath}/decentraland.godot.client.x86_64 --rendering-driver opengl3 --avatar-renderer --avatars ${avatarDataPath}
    `
    const areFilesCreated = (payload: any): boolean => {
      for (const avatar of payload) {
        if (!existsSync(avatar.destPath)) {
          return false
        }
      }
      return true
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        if (!areFilesCreated(payloads)) {
          console.error(error, stderr)
          reject(error)
        }
      }
      if (stderr) {
        if (!areFilesCreated(payloads)) {
          console.error(stderr)
          reject(error)
        }
      }
      rmSync(avatarDataPath)
      resolve(results)
    })
  })
}