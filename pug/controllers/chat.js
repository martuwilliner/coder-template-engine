const fs = require('fs');
const path = require('path');
class ChatApi {
    constructor() {
        this.messages = this.getAllMessages();
        this.id = this.messages.length > 0 ? this.messages[this.messages.length - 1].id + 1 : 1;
    }
    getAllMessages() {
        return JSON.parse(fs.readFileSync(path.join(__dirname, '../data/chat.json')));
    }
    saveMessage(message) {
        const newMessage = {
            id: this.id,
            ...message
        }
        this.messages.push(newMessage);
        fs.writeFileSync(path.join(__dirname, '../data/chat.json'), JSON.stringify(this.messages));
    }
}

module.exports = ChatApi;