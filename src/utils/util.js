const extractMentions = function(text) {
    const emails = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const mentions = [];
    if(Array.isArray(emails)) {
        emails.forEach(email => {
            const entry = `@${email}`;
           if(text.search(entry) !== -1) {
            mentions.push(email);
           }
        });
    }
    return mentions;
    }
    module.exports = extractMentions;