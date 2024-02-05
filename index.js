
try {

  const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js');
  const fetch = require('node-fetch')
  const discord = require("discord.js")
  const { Client, Intents, Collection } = require('discord.js');

  require('dotenv').config()

  const { promisify } = require("util");
  const http = require('http');
  const { Util: { escapeMarkdown } } = require('discord.js');
  const fs = require("fs")
  const { SlashCommandBuilder } = require('@discordjs/builders');
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');
  const roblox = require("noblox.js")
  const token = "MTExNDI1NzQxMjA2OTc5ODA0OA.GwDCpk.HFI0hL1OeugdF_Gmpr6XBsZwBPUgqXIG-YQezI"



  const config = require("./config.js");
  const server = require("./server.js");

  const clientId = config.botid


  const { permrole } = require('./config.js');

  // Create a new client instance
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES], partials: ['MESSAGE', 'CHANNEL'] });
  const redis = require("redis");
  const asyncredis = require("async-redis");
  



  const rediscli = asyncredis.createClient({url: "redis://redis-10698.c326.us-east-1-3.ec2.cloud.redislabs.com:10698", password: "QfWULXWl7W1xdIkzYsNHVUGbOpiVhSmb" })
  client.redisClient = rediscli
  client.getData = async (key) => {
    let data = await client.redisClient.get(key)
    return JSON.parse(data)
  }

  client.setData = async (key, val, toSet) => {
    let data = await client.redisClient.set(key, JSON.stringify(val, null, 2))
    return data 
  }

  client.commands = new Collection();
  client.aliases = new Collection();
  // ready system

  client.on('ready', async() => {
    console.log('Ready!');

    server(client)

    client.user.setActivity("Whatever...", { status: "dnd" }, { type: "WATCHING" })
  });


  client.on("error", (error) => {
    return console.error(error)
  });
  /// ----
  //splashes commands

  // dangous xd 
  const commands = [

    new SlashCommandBuilder().setName('help').setDescription('Help command'),

    new SlashCommandBuilder().setName('delkey').setDescription('Delete a key').addStringOption(option => option.setName('key').setDescription("Enter key").setRequired(true)),

    new SlashCommandBuilder().setName('genkey').setDescription('Generate a key')
      .addUserOption(option => option.setName('target').setDescription('Select a user').setRequired(true))

          .addStringOption(option => option.setName('product').setDescription("Enter the product name").setRequired(true)),

    new SlashCommandBuilder().setName('keyinfo').setDescription('Get user keys').addUserOption(option => option.setName('target').setDescription("Check someone else keys. [ADMINS]")),

    new SlashCommandBuilder().setName('whitelist').setDescription('Whitelist an entity').addSubcommand(subcommand =>
      subcommand
        .setName("add")
        .setDescription('Whitelist an entity')
        .addStringOption(option => option.setName('key').setDescription("Enter the key (o!keyinfo)").setRequired(true))
        .addNumberOption(option => option.setName('link_id').setDescription('Enter a User/Group ID').setRequired(true)))
      .addSubcommand(subcommand =>
        subcommand
          .setName("remove")
          .setDescription('Remove a whitelist')
          .addStringOption(option => option.setName('key').setDescription("Enter the key (o!keyinfo)..").setRequired(true))
          .addNumberOption(option => option.setName('link_id').setDescription('Enter a User/Group ID').setRequired(true))),



  ].map(command => command.toJSON());

  client.commands = new Collection();

    setTimeout(async() => {

  const rest = new REST({ version: '9' }).setToken(token);

  (async () => {
    try {
      console.log('Started refreshing application (/) commands.');


      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
  })();
    }, 60000)



  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;


    function genID() {
      var d = new Date().getTime();
      var d2 = d
      if (typeof d2 !== 'undefined' && typeof d2.now === 'function') {
        d += performance.now();
      }
      return 'FLINT-xyxyx-yyxxx-yyxyy-xyyyx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    }



    try {
      await interaction.deferReply()

      if (interaction.commandName === "whitelist") {

        const check = fetch('https://api.blox.link/v4/public/guilds/1113684241247641721/discord-to-roblox/' + interaction.user.id, {
          headers: { "Authorization": "7dfd8f8f-f9e7-43da-b7a8-88e854aacbdf" }})
            .then(res => res.json())
            .then(json => {
              console.log(json)
              const userid = json.robloxID;
    
              console.log(userid); //UserId do be undefined
    
              const rank = roblox.getRankInGroup("15825507", userid).then(rank => {
                if (!json.error) {
                  console.log(rank);
                  
                  if (rank === 0) {
                    const embed = new discord.MessageEmbed()
                      .setTitle("Error")
                      .setDescription("Permission error: USER_NOT_IN_GROUP")
                      .setColor("RED");
                    return interaction.editReply({ embeds: [embed] });
                    return false;
                  }
                } else {
                  return interaction.editReply({ content:
          
                    "You are not verified with BloxLink, please run `/verify`"
                });
                };
              
            
    
      
      
      let productKey = interaction.options.getString("key")
      let action = interaction.options.getSubcommand()
      let id = interaction.options.getNumber("link_id")
    
      console.log(id)
      let maxSlotCount = 1;
    
    
      client.getData(productKey).then(keyData => {
    
          if (keyData.user == interaction.user.id || interaction.member.roles.cache.some(role => role.name === config.permrole)) {
            if (action == "add") {
              let count = Object.keys(keyData.allowedIds).length;
              if (count > 0)
              return interaction.editReply({ content:
                config.emotes.deny +
                    " Sorry, you have already hit the maximum amount of whitelisted IDs for this key."
              });
              if (isNaN(id))
              return interaction.editReply({ content:
                config.emotes.deny + " This ID is invalid."
              });
              roblox.getGroup(id)
                .then(result => {
                  interaction.editReply({ content:
                    `${config.emotes.accept} Alright, I've added **${result.name}** to your whitelist. Any game under this group will be whitelisted.`
                });
                  keyData.allowedIds[id] = true;
                  client.setData(productKey, keyData);
                })
                .catch(err => {
                  console.log(err)
                  roblox.getPlayerInfo(id)
                    .then(result => {
                      interaction.editReply({ content:
                        `${config.emotes.accept} Alright, I've added **$@${result.username}** to your whitelist. Any game under this user's profile will be whitelisted.`
                    });
                      keyData.allowedIds[id] = true;
                      client.setData(productKey, keyData);
                    })
                    .catch(err => {
                      return interaction.editReply({ content:
                        config.emotes.deny +
                          " The ID provided was invalid. Please provide a valid **User ID or Group ID.**"
                    });
                    });
                });
            } else if (action == "remove") {
              if (keyData.allowedIds[id]) {
                delete keyData.allowedIds[id];
                client.setData(productKey, keyData);
                interaction.editReply({ content:
                  `${config.emotes.accept} That ID was removed from your whitelist.`
              });
              } else {
                interaction.editReply({ content:
                  config.emotes.deny +
                    "This ID was not found in your whitelist."
              });
              }
            } else {
              interaction.editReply({ content:
                config.emotes.deny +
                  " Invalid action. Please provide **add** or **remove** to add or remove an ID to your whitelist."
            });
            }
          } else {
            interaction.editReply({ content:
              config.emotes.deny +
                " You do not have permission to edit the whitelisting for this key."
          });
          }
        })
        .catch(err => {
          console.log(err)
          interaction.editReply({ content:
            config.emotes.deny +
              " This key does not exist in the database. Please make sure you've spelt it correctly."
        });
        });
                
              });
            });
        
    

      }


      if (interaction.commandName === 'keyinfo') {
        let member = interaction.options.getUser('target')

        if (member && !interaction.member.roles.cache.some(r => r.name == config.permrole)){
           return interaction.editReply(`${config.emotes.deny} Only staff members can check the key info of other users.`)
        }
        if (member && interaction.member.roles.cache.some(r => r.name == config.permrole)) member = member
        if(!member) member = interaction.user

    

        
        
        let keyInfo = {}
        let keyProducts = {}
        let allKeys = await client.redisClient.keys("*") // retrieves all keys from db in an array
        // this is an O(N) operation. will be somewhat expensive as db grows
        for (let index in allKeys) {
          let key = allKeys[index]
          let keyData = await client.getData(key)
          console.log(key + " " + keyData)
          if (keyData.user && keyData.user == member.id) {
            let whitelisted = Object.keys(keyData.allowedIds)
            let names = []
            for (let ind in whitelisted) {
              let id = whitelisted[ind]
              try {
                let groupInfo = await roblox.getGroup(Number(id))
                names.push(`\`Group - ${groupInfo.name} (ID ${id})\``)
              } catch {
                try {
                  let userInfo = await roblox.getPlayerInfo(Number(id))
                  names.push(`\`User - @${userInfo.username} (ID ${id})\``)
                } catch {
                  names.push(`**INVALID_ID - (ID ${id})**`)
                }
              }
            }
            keyInfo[key] = whitelisted.length > 0 ? `Whitelisted for **${names.join(", ")}**` : "Nobody has been whitelisted yet for this key."
            console.log(keyData.product)
            if (keyData.product == "admin" || keyData.product == "shopgui"){
              delete keyData

            }else{
            let keylool = config.products[keyData.product]
            keyProducts[key] = keylool.name
            }
            
          }
        }
        
        const embed = new discord.MessageEmbed()
        embed.setColor(config.embedColors.default)
        embed.setTitle(`Key information for ${member.tag}`)
        for (let key in keyInfo) {
          embed.addField(key + " - " + keyProducts[key], keyInfo[key])
        }
        if (Object.keys(keyInfo).length == 0) embed.setDescription("This user doesn't have any keys!")
        embed.setTimestamp()
        



        interaction.editReply({ content: "Check DMs!" })
        interaction.user.send({ embeds: [embed] }).catch(err => {
          interaction.channel.send("Please open your DMs.")
        })

      }




        if (interaction.commandName === "delkey") {

          const key = interaction.options.getString("key")

          client.redisClient.del(key).then((result) => {
   
            if (result > 0) {
    
              interaction.editReply({ content:
     
                `${config.emotes.accept} The key was deleted.`
            });
              
            } else {
      interaction.edit({ content: 
        `${config.emotes.deny} The key does not exist in the database.`
            });
    }
  });
        }

        if (interaction.commandName === "genkey") {


          if (!interaction.member.roles.cache.some(role => role.name === 'Bot Access')) return interaction.editReply({ content: "Only staff members may generate keys." })


          let memberToBindTo = interaction.options.getMember('target');
          let product = interaction.options.getString("product")

          let productsToList = []
  
    
          for (let productName in config.products) {
            productsToList.push("`" + productName + "`")
          }

          let productList = productsToList.join("\n")
          if (!memberToBindTo) return interaction.editReply({ content: `${config.emotes.deny} Please provide a user to generate a key for.` })
          if (!config.products[product]) return interaction.editReply({ content: `${config.emotes.deny} Please provide a valid **product** to bind this key to. You can provide these:\n\n` + productList })
          
          let properName = config.products[product].name



            let newKey = genID()



            let keyToUserFormat = {
              user: memberToBindTo.id,
              allowedIds: {},
              product: product
            }
            client.setData(newKey, keyToUserFormat)



            interaction.editReply({ content: "Alright, generated a key for **" + memberToBindTo.user.tag + `** (${memberToBindTo.user.id}).\nThis will allow them to use ${product} for **one** entity.\nPlease give them this key: **${newKey}**` })

        }


        if (interaction.commandName === "help") {
          let embed = new MessageEmbed()
          .setColor(config.embedColors.default)
          .setTitle(`${client.user.username} commands!`)
            .setDescription("Select one of those options.")
            .setFooter(`Made by fedee#9606`)
            .setTimestamp();
          const row = new MessageActionRow()
            .addComponents(
              new MessageSelectMenu()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions([
                  {
                    label: '📃 Information',
                    description: 'Information commands!',
                    value: 'information',
                  },
                  {
                    label: '🛡 Staff',
                    description: 'Staff commands!',
                    value: 'staff',
                  },
                ]),
            );

          const sentMessage = await interaction.editReply({ embeds: [embed], components: [row] });

          const filter2 = i => i.customId === 'select' && i.user.id === i.user.id;
          const collector = interaction.channel.createMessageComponentCollector({ filter2, time: 15000 });
          collector.on('collect', async i => {
            if (i.customId === 'select') {


               if (i.values[0] === 'information') {

                const info = new MessageEmbed()
                .setColor(config.embedColors.default)
                .setTitle("📃 Information Commands!")
                  .setDescription("Use -help <command name> for more command information! \n\n`Help,\nping,\nkeyinfo,\nwhitelist`")
                  .setFooter(`Made by fedee#9606`)
                  .setTimestamp();
                row.components[0].setDisabled(true)
                return i.message.edit({ embeds: [info], components: [row] })

              } else if (i.values[0] === 'staff') {

                const staff = new MessageEmbed()
                .setColor(config.embedColors.default)
                .setTitle("🎧 Staff Commands!")
                  .setDescription("Use -help <command name> for more command information! \n\n`Genkey, \ndeletekey`")
                  .setFooter(`Made by fedee#9606`)
                  .setTimestamp();
                row.components[0].setDisabled(true)
                return i.message.edit({ embeds: [staff], components: [row] })

              }


            }
          })




        }

        if (interaction.commandName === 'ping') {
          const embed = new MessageEmbed()
            .setColor("GOLD")
            .setDescription(`🏓Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`)
            .setTimestamp();
          await interaction.editReply({ embeds: [embed] })
        }




    } catch (err) {
      console.log(err)
      return interaction.editReply({ content: `Something went wrong, try again later!`, ephemeral: true });

    }

  });

  // ---





  client.login(token)


} catch (e) {
  return console.log(e);
}