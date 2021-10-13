const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'p',
    description: 'Plays music',
    async execute(message, args) {

        const voiceChannel = message.member.voice.channel; //the current voice channel the user is in

        if (!voiceChannel) return message.channel.send('Fly to voice channel first pwease');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('Oops it seems you do not have the required permissions'); // checks if user has permission
        if (!permissions.has('SPEAK')) return message.channel.send('Oops it seems you do not have the required permissions'); // checks if user has permission
        if (!args.length) return message.channel.send('Oh no ya forgot the second argument'); // checks if the second argument has been entered

        const validURL = (str) =>{
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/; // validate link
            if(!regex.test(str)){
                return false;
            } else {
                return true;
            }
        }

        if(validURL(args[0])) {

            const  connection = await voiceChannel.join();
            const stream  = ytdl(args[0], {filter: 'audioonly'});
 
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () =>{
                voiceChannel.leave();
                message.channel.send('leaving channel');
            });
 
            await message.reply(`:thumbsup: Now Playing ***Your Link***`)
 
            return // IMPORTANT breaks out of the code

        }


        const connection = await voiceChannel.join(); //bot joins voice channel

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null; // checks for the list of videos and returns the first one
        }

        const video = await videoFinder(args.join(' '));

        if(video) { // plays the video audio and leaves voice channel

            const stream = ytdl(video.url,{filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
                message.channel.send('leaving channel');
            })

            await message.reply(`:thumbsup: Now Playing ***${video.title}***`)
        } else {
            message.channel.send('Oopsie no results found');
        }

    }
}