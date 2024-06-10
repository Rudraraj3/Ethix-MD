import Tesseract from 'tesseract.js';
import { writeFile } from 'fs/promises';

const givetextCommand = async (m, Matrix) => {
  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const validCommands = ['givetext', 'extract'];

   if (validCommands.includes(cmd)) {
    if (!m.quoted || m.quoted.mtype !== 'imageMessage') {
      return m.reply(`Send/Reply with an image to extract text ${prefix + cmd}`);
    }

    try {
      const media = await m.quoted.download(); // Download the media from the quoted message
      if (!media) throw new Error('Failed to download media.');

      const filePath = `./${Date.now()}.png`;
      await writeFile(filePath, media); // Save the downloaded media to a file

      // Perform OCR using Tesseract.js
      const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m)
      });

      const responseMessage = `Extracted Text:\n\n${text}`;
      await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m }); // Send the extracted text back to the user
    } catch (error) {
      console.error("Error extracting text from image:", error);
      await Matrix.sendMessage(m.from, { text: 'Error extracting text from image.' }, { quoted: m }); // Error handling
    }
  }
};

export default givetextCommand;
