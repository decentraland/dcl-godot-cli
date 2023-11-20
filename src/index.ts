import { exec } from "child_process";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

let executionNumber = 0

export function generateAvatars(addresses: string[]): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    if (!existsSync('output/')) mkdirSync('output')
    if (!existsSync('input/')) mkdirSync('input')

    executionNumber += 1
    const catalystBaseUrl = `https://peer.decentraland.org`

    let payload: any[] = []
    let outputs: string[] = []
    for (const address of addresses) {
      // TODO: Can execute the request in parallel, and waiting them with Promise.all
      const response = await fetch(`${catalystBaseUrl}/lambdas/profiles/${address}`)
      const data = await response.json()
      const destPath = `output/${address}.png`
      payload.push({
        destPath,
        avatar: data.avatars[0].avatar
      })
      outputs.push(destPath)
    }

    const output = {
      baseUrl: `${catalystBaseUrl}/content`,
      payload
    }
    await writeFile(`input/avatars${executionNumber}.json`, JSON.stringify(output))
    const explorerPath = process.env.EXPLORER_PATH || '.'
    const command = `
      DISPLAY=:99 ${explorerPath}/decentraland.godot.client.x86_64 --rendering-driver opengl3 --avatar-renderer --avatars input/avatars${executionNumber}.json
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
        if (!areFilesCreated(payload)) {
          console.error(error, stderr)
          reject(error)
        }
      }
      if (stderr) {
        if (!areFilesCreated(payload)) {
          console.error(stderr)
          reject(error)
        }
      }
      resolve(outputs)
    })
  })
}