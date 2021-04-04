const { Client, User } = require('discord.js');
const { connect } = require('mongoose');
const prefix = '$';
const client = new Client();
let UserModel = require('./models/BlackListSys');
client.on('ready', _ => {
    console.log('Ready');
    connect("MONGODB_URL_HERE", {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(() => {
        console.log('DB Online');
    }).catch((err) => {
        console.log(err);
    })
});

let devs = [];
client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + 'blacklist')) {
        if (!devs.includes(message.author.id)) return message.channel.send(`**You Don't in Dev Array**`);
        let args = message.content.split(' ');
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if (!user) return message.channel.send(`**:x: | Use: ${prefix}blacklist \`<@UserID>\`**`);
        if (user.id === message.author.id) return message.channel.send(`**:x: | You Can't Give BlackList to YourSelf**`);

        let Data = await UserModel.findOne({ UserID: user.id });
        if (!Data) {
            Data = new UserModel({
                UserID: user.id
            });
            await Data.save().catch((err) => console.log(err));
        }
        await UserModel.findOneAndUpdate({ UserID: user.id });
        message.channel.send(`**Done Give BlackList To <@${Data.UserID}>**`).then(async () => {
            let UserFetch = await message.guild.members.cache.get(Data.UserID);
            message.guild.member(UserFetch).ban();
        })
    }
});

client.on('guildMemberAdd', async (member) => {
    let Data = await UserModel.findOne({ UserID: member.id });
    if (Data.UserID) {
        member.ban({ reason: 'BlackListed From Bot' })
    } else {
        console.log('Join Easy')
    }
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix + 'unblacklist')) {
        if (!devs.includes(message.author.id)) return message.channel.send(`**You Don't in Dev Array**`);
        let args = message.content.split(' ');
        if (!args[1]) return message.channel.send(`**:x: | Use: ${prefix}unblacklist \`<@UserID>\`**`);
        if (args[1] === message.author.id) return message.channel.send(`**:x: | You Can't UnBlackList to YourSelf**`);

        let Data = await UserModel.findOne({ UserID: args[1] });
        await UserModel.findOneAndDelete({ UserID: args[1] });
        message.channel.send(`**Done Give UnBlackList To <@${args[1]}>**`);
    }
});


client.login('');
