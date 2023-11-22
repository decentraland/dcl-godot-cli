import { generateAvatars } from '../src';

jest.setTimeout(60000)

test('test generate avatars', async () => {
    const outputs = await generateAvatars([
        '0xC447A2295E9479BBB7B31491f7DC90A517bd5F45',
        '0x481bed8645804714Efd1dE3f25467f78E7Ba07d6'
    ], {
        outputPath: "output"
    })
    expect(outputs).toEqual([
        { avatarPath: 'output/0xC447A2295E9479BBB7B31491f7DC90A517bd5F45.png' },
        { avatarPath: 'output/0x481bed8645804714Efd1dE3f25467f78E7Ba07d6.png' }])
})

test('test generate avatars faces low resolution', async () => {
    const outputs = await generateAvatars([
        '0xC447A2295E9479BBB7B31491f7DC90A517bd5F45',
        '0x481bed8645804714Efd1dE3f25467f78E7Ba07d6'
    ], {
        outputPath: "output",
        face: true,
        width: 256,
        height: 512
    })
    expect(outputs).toEqual([
        {
            avatarPath: 'output/0xC447A2295E9479BBB7B31491f7DC90A517bd5F45.png',
            facePath: 'output/0xC447A2295E9479BBB7B31491f7DC90A517bd5F45_face.png'
        },
        {
            avatarPath: 'output/0x481bed8645804714Efd1dE3f25467f78E7Ba07d6.png',
            facePath: 'output/0x481bed8645804714Efd1dE3f25467f78E7Ba07d6_face.png'
        }])
})

