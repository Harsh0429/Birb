module.exports = {
    name: 'kick',
    description: 'Stops the bot',
    async execute(message, args) {
        const voiceChannel = message.member.voice.channel;
 
        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to stop the music!"); // user is in voice channel to kick bot
        await voiceChannel.leave();
        await message.channel.send('Leaving channel babyee')
    }


}