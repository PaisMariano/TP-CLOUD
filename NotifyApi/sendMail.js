const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const getGmailClient = require('./gmailClient.js');

function sendMessage(anEmail, aSubject, aMessage){
  // Obtiene un objeto JJJJJ a partir del credentials.json y token.json
  const gmailClient = getGmailClient();
  // Envia un mail, utilizando la funcion ZZZZ que termina haciendo un request a XXXXX
  gmailClient.users.messages.send(
    {
      userId: 'me',
      requestBody: {
        raw: createMessage(anEmail, aSubject, aMessage),
      },
    }
  );
}

function createMessage(anEmail, aSubject, aMessage) {
    // You can use UTF-8 encoding for the subject using the method below.
    // You can also just use a plain string if you don't need anything fancy.
    const utf8Subject = `=?utf-8?B?${Buffer.from(aSubject).toString('base64')}?=`;
    const messageParts = [
      'From: UNQFy <paismarianoa@gmail.com>',
      'To: ' + anEmail + ' <' + anEmail + '>',
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      aMessage,
    ];
    const message = messageParts.join('\n');
  
    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  
    return encodedMessage;
}

module.exports.sendMessage = sendMessage;