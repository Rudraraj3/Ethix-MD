const ping = async (m, sock) => {
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
  if (cmd === "ping") {

    const startTime = new Date();
    const { key } = await sock.sendMessage(m.from, { text: '*_𐎓⃝мαѕтєя мιη∂𒐕꯭꯭𒐕꯭꯭..._*' }, { quoted: m });
    await m.React('🚀');

    const text = `*_𐎓⃝мαѕтєя мιη∂ 𒐕꯭꯭𒐕꯭꯭ν3: ${new Date() - startTime} ms_*`;
    await typeWriterEffect(m, sock, key, text);

    await m.React('🇮🇳');
  }
}

const typeWriterEffect = async (m, sock, key, message) => {
  const typingSpeed = 300;
  const words = message.split(' ');
  let i = 0;

  const typewriterInterval = setInterval(() => {
    if (i < words.length) {
      const typedText = words.slice(0, i + 1).join(' ');
      sock.relayMessage(m.from, {
        protocolMessage: {
          key: key,
          type: 14,
          editedMessage: {
            conversation: typedText,
          },
        },
      }, {});
      i++;
    } else {
      clearInterval(typewriterInterval); 
    }
  }, typingSpeed);
}

export default ping;
