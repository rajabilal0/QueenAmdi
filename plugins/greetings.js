/**
* @project_name Queen Amdi [WA Multi-device]
* @author BlackAmda <https://github.com/BlackAmda>
* @description A WhatsApp based 3ʳᵈ party application that provide many services with a real-time automated conversational experience
* @link <https://github.com/BlackAmda/QueenAmdi>
* @version 4.0.0
* @file  greetings.js - QueenAmdi group greeting messages generator

© 2022 Black Amda, ANTECH. All rights reserved.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.*/

const { AMDI, amdiDB, Language } = require('../assets/scripts')
const { downloadContentFromMessage } = require("@adiwajshing/baileys");
let { img2url } = require('@blackamda/telegram-image-url')
const { writeFile } = require('fs/promises');
const { setWelcome, removeWelcome, getWelcome, setBye, removeBye, getBye } = amdiDB.greetingsDB
const Lang = Language.getString('greetings');

const getFileName = (ext) => { return `${Math.floor(Math.random() * 10000)}${ext}` };


AMDI({ cmd: "setwelcome", desc: Lang.setwelDesc, example: Lang.setwelEx, type: "admin", react: "➕" }, (async (amdiWA) => {
    let { isGroup, isReply, reply, reply_message } = amdiWA.msgLayout;

    if (!isGroup) return reply(Lang.notGrp)

    if (!isReply) return reply(Lang.needReplymsg)

    if (reply_message.imageMessage) {
        if (!reply_message.imageMessage.caption) return reply(Lang.needCaption)

        let downloadFilePath = reply_message.imageMessage;
        const stream = await downloadContentFromMessage(downloadFilePath, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        const filename = getFileName('.png');
        await writeFile(filename, buffer);
        const imgURL = await img2url(filename)

        var note = ''
        if (!reply_message.imageMessage.caption.includes('#')) {
            note = reply_message.imageMessage.caption
        } else if (reply_message.imageMessage.caption.includes('#')) {
            note = reply_message.imageMessage.caption.replace(/#/g, '\n')
        }
        await setWelcome(amdiWA.clientJID, note, imgURL)
        return await reply(Lang.WelcomSetted, "✅");
    } else {
        const imgURL = 'https://i.ibb.co/XCfhtfH/301820a4f3c0.jpg'
        const note = reply_message.conversation
        await setWelcome(amdiWA.clientJID, note, imgURL)
        return await reply(Lang.WelcomSetted, "✅");
    }
}));


AMDI({ cmd: "getwelcome", desc: Lang.getwelDesc, type: "admin", react: "📘" }, (async (amdiWA) => {
    let { isGroup, reply, sendImage } = amdiWA.msgLayout;

    if (!isGroup) return;
    let weldata = await getWelcome(amdiWA.clientJID)
    if (weldata == -1 || weldata.welnote == 'blank') return reply(Lang.nowelset)

    return await sendImage({ url: weldata.welpicurl }, {caption: '🔗 *Image URL :* \n' + weldata.welpicurl + '\n\n📄 *Welcome note :* \n' + weldata.welnote, quoted: true, reactEmoji: "📖"});
}));


AMDI({ cmd: "delwelcome", desc: Lang.delwelDesc, type: "admin", react: "🚮" }, (async (amdiWA) => {
    let { isGroup, reply, react } = amdiWA.msgLayout;

    if (!isGroup) return;
    let weldata = await getWelcome(amdiWA.clientJID)
    if (weldata == -1 || weldata.welnote == 'blank') return reply(Lang.nowelset)

    await removeWelcome(amdiWA.clientJID)
    return await reply(Lang.WelcomeDeleted, "✅");
}));


AMDI({ cmd: "setbye", desc: Lang.setbyeDesc, example: Lang.setbyeEx, type: "admin", react: "➕" }, (async (amdiWA) => {
    let { isGroup, isReply, reply, reply_message } = amdiWA.msgLayout;

    if (!isGroup) return reply(Lang.notGrp)

    if (!isReply) return reply(Lang.needReplymsg)

    if (reply_message.imageMessage) {
        if (!reply_message.imageMessage.caption) return reply(Lang.needCaption_)

        let downloadFilePath = reply_message.imageMessage;
        const stream = await downloadContentFromMessage(downloadFilePath, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        const filename = getFileName('.png');
        await writeFile(filename, buffer);

        const imgURL = await img2url(filename)
        
        var note = ''
        if (!reply_message.imageMessage.caption.includes('#')) {
            note = reply_message.imageMessage.caption
        } else if (reply_message.imageMessage.caption.includes('#')) {
            note = reply_message.imageMessage.caption.replace(/#/g, '\n')
        }
        await setBye(amdiWA.clientJID, note, imgURL)
        return await reply(Lang.ByeSetted, "✅");
    } else {
        const imgURL = 'https://i.ibb.co/pbjB2pS/93f527f9f2fb.jpg'
        const note = reply_message.conversation
        await setBye(amdiWA.clientJID, note, imgURL)
        return await reply(Lang.ByeSetted, "✅");
    }
}));


AMDI({ cmd: "getbye", desc: Lang.getbyeDesc, type: "admin", react: "📘" }, (async (amdiWA) => {
    let { isGroup, reply } = amdiWA.msgLayout;

    if (!isGroup) return
    let byedata = await getBye(amdiWA.clientJID)
    if (byedata == -1 || byedata.byenote == 'blank') return reply(Lang.nobyeset)

    return await sendImage({ url: byedata.byepicurl }, {caption: '🔗 *Image URL :* \n' + byedata.byepicurl + '\n\n📄 *Bye note :* \n' + byedata.byenote, quoted: true, reactEmoji: "📖"});
}));


AMDI({ cmd: "delbye", desc: Lang.delbyeDesc, type: "admin", react: "🚮" }, (async (amdiWA) => {
    let { isGroup, reply } = amdiWA.msgLayout;

    if (!isGroup) return
    let byedata = await getBye(amdiWA.clientJID)
    if (byedata == -1 || byedata.welnote == 'blank') return reply(Lang.nobyeset)

    await removeBye(amdiWA.clientJID)
    return await reply(Lang.ByeDeleted, "✅");
}));