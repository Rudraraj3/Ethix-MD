import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;
import pkgg from 'nayan-media-downloader';
const { tikdown } = pkgg;

// Global map to store search results and current index
const searchResultsMap = new Map();
let searchIndex = 1; // Global index for search results

const tiktokCommand = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['tiktok', 'tt', 'ttdl'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('Please provide a TikTok URL.');
    }

    try {
      await m.React("🎊");

      // Fetch TikTok data
      const tikTokData = await tikdown(text);
      if (!tikTokData.status) {
        await m.reply('No results found.');
        await m.React("🙆‍♂️");
        return;
      }

      // Store TikTok data in global map
      searchResultsMap.set(searchIndex, tikTokData);

      // Create buttons for the result
      const currentResult = searchResultsMap.get(searchIndex);
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "Video",
            id: `media_video_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "Audio",
            id: `media_audio_${searchIndex}`
          })
        }
      ];

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `🔍 Title: ${currentResult.data.title}\nAuthor: ${currentResult.data.author.nickname}\nViews: ${currentResult.data.view}\nDuration: ${currentResult.data.duration}s\n\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© Powered By мαѕтєя мιη∂ 𒐕꯭꯭𒐕꯭꯭ν3"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: false,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("🇮🇳");

      searchIndex += 1; // Increment the global search index for the next set of results
    } catch (error) {
      console.error("Error processing your request:", error);
      await m.reply('Error processing your request.');
      await m.React("🙆‍♂️");
    }
  } else if (selectedId) { // Check if selectedId exists
    if (selectedId.startsWith('media_')) {
      const parts = selectedId.split('_');
      const type = parts[1];
      const key = parseInt(parts[2]);
      const selectedMedia = searchResultsMap.get(key);

      if (selectedMedia) {
        try {
          const videoUrl = selectedMedia.data.video;
          const audioUrl = selectedMedia.data.audio;
          let finalMediaBuffer, mimeType, content;

          if (type === 'video') {
            finalMediaBuffer = await getStreamBuffer(videoUrl);
            mimeType = 'video/mp4';
          } else if (type === 'audio') {
            finalMediaBuffer = await getStreamBuffer(audioUrl);
            mimeType = 'audio/mpeg';
          }

          const fileSizeInMB = finalMediaBuffer.length / (1024 * 1024);

          if (type === 'video' && fileSizeInMB <= 300) {
            content = { video: finalMediaBuffer, mimetype: 'video/mp4', caption: ' *© Powered by мαѕтєя мιη∂ 𒐕꯭꯭𒐕꯭꯭ν3*' };
          } else if (type === 'audio' && fileSizeInMB <= 300) {
            content = { audio: finalMediaBuffer, mimetype: 'audio/mpeg', caption: ' *© Powered by мαѕтєя мιη∂ 𒐕꯭꯭𒐕꯭꯭ν3*' };
          }

          await Matrix.sendMessage(m.from, content, { quoted: m });
        } catch (error) {
          console.error("Error processing your request:", error);
          await m.reply('Error processing your request.');
          await m.React("❌");
        }
      }
    }
  }
};

const getStreamBuffer = async (url) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export default tiktokCommand;
