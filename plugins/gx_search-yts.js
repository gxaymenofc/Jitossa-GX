


/* import yts from 'yt-search'
import fs from 'fs'

let handler = async (m, {conn, text }) => {
  if (!text) throw '*هاذا الأمر خاص بالبحث في يوتوب* \n\n مثال .yts morocco sahara '
  await conn.reply(m.chat, global.wait, m)
  let results = await yts(text)
  let tes = results.all
  let teks = results.all.map(v => {
    switch (v.type) {
      case 'video': return `
° *_${v.title}_*
↳ 🫐 *_Link :_* ${v.url}
↳ 🕒 *_Duration :_* ${v.timestamp}
↳ 📥 *_Uploaded :_* ${v.ago}
↳ 👁 *_Views :_* ${v.views}`}}).filter(v => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n')
  conn.sendFile(m.chat, tes[0].thumbnail, 'yts.jpeg', teks, m)
}

handler.help = ['yts <query>']
handler.tags = ['search']
handler.command = /^yts(earch)?$/i

export default handler*/
/*

- Agradecimiento a la comunidad de "WSApp • Developers"
 * https://chat.whatsapp.com/FaQunmlp9BmDRk6lEEc9FJ
- Agradecimiento especial a Carlos (PT) por los codigos de interactiveMessage (botones)
- Agradecimiento a Darlyn1234 por la estructura de uso en este codigo y quoted
 * https://github.com/darlyn1234
- Adaptacion de imagen en tipo lista, codigo y funcionamiento por BrunoSobrino
 * https://github.com/BrunoSobrino

*/
import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'
import yts from 'yt-search';
import fs from 'fs';

const handler = async (m, { conn, text, usedPrefix: prefijo }) => {
    const datas = global;
    const idioma = datas.db.data.users[m.sender].language;
    const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`));
    const traductor = _translate.plugins.buscador_yts;
    const device = await getDevice(m.key.id);
    
  if (!text) throw `⚠️ *${traductor.texto1}*`;
    
  if (device !== 'desktop' || device !== 'web') {      
    
  const results = await yts(text);
  const videos = results.videos.slice(0, 20);
  const randomIndex = Math.floor(Math.random() * videos.length);
  const randomVideo = videos[randomIndex];

  var messa = await prepareWAMessageMedia({ image: {url: randomVideo.thumbnail}}, { upload: conn.waUploadToServer })
  const interactiveMessage = {
    body: { text: `*—◉ Results:* ${results.videos.length}\n*—◉ Informations:*\n*-› Title:* ${randomVideo.title}\n*-› Author:* ${randomVideo.author.name}\n*-› Views:* ${randomVideo.views}\n*-› ${traductor.texto2[0]}:* ${randomVideo.url}\n*-› Imagen:* ${randomVideo.thumbnail}`.trim() },
    footer: { text: `${global.wm}`.trim() },  
      header: {
          title: `*< YouTube Search />*\n`,
          hasMediaAttachment: true,
          imageMessage: messa.imageMessage,
      },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: 'DISPONIBLE OPTIONS',
            sections: videos.map((video) => ({
              title: video.title,
              rows: [
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'MP3',
                  id: `.yta ${video.url}`
                },
                {
                  header: video.title,
                  title: video.url,
                  description: 'MP3 DOCUMENT',
                  id: `.ytadoc ${video.url}`
                },
                  {
                  header: video.title,
                  title: video.author.name,
                  description: 'MP4',
                  id: `.ytv ${video.url}`
                },
                {
                  header: video.title,
                  title: video.author.name,
                  description: 'MP4 DOCUMENT',
                  id: `.ytvdoc ${video.url}`
                }
              ]
            }))
          })
        }
      ],
      messageParamsJson: ''
    }
  };        
            
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: m })
      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});

  } else {
  const datas = global;
  const idioma = datas.db.data.users[m.sender].language;
  const _translate = JSON.parse(fs.readFileSync(`./language/${idioma}.json`));
  const traductor = _translate.plugins.buscador_yts;      
  const results = await yts(text);
  const tes = results.all;
  const teks = results.all.map((v) => {
    switch (v.type) {
      case 'video': return `
° *_${v.title}_*
↳ 🫐 *_${traductor.texto2[0]}_* ${v.url}
↳ 🕒 *_${traductor.texto2[1]}_* ${v.timestamp}
↳ 📥 *_${traductor.texto2[2]}_* ${v.ago}
↳ 👁 *_${traductor.texto2[3]}_* ${v.views}`;
    }
  }).filter((v) => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n');
  conn.sendFile(m.chat, tes[0].thumbnail, 'error.jpg', teks.trim(), m);      
  }    
};
handler.help = ['ytsearch <texto>'];
handler.tags = ['search'];
handler.command = /^(ytsearch|yts|searchyt|buscaryt|videosearch|audiosearch)$/i;
export default handler;
