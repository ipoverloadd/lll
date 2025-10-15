const LogConfig = require('../models/serverLogs/LogConfig');
const { 
    ChannelType,
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    ThumbnailBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MessageFlags
} = require('discord.js');
const logHandlersIcons = require('../UI/icons/loghandlers');

module.exports = async function channelCreateHandler(client) {
    client.on('channelCreate', async (channel) => {
        const config = await LogConfig.findOne({ guildId: channel.guild.id, eventType: 'channelCreate' });

        if (!config || !config.channelId) return;

        const logChannel = client.channels.cache.get(config.channelId);
        if (logChannel) {

            const channelType = {
                [ChannelType.GuildText]: 'Text Channel',
                [ChannelType.GuildVoice]: 'Voice Channel',
                [ChannelType.GuildCategory]: 'Category',
                [ChannelType.GuildAnnouncement]: 'Announcement Channel',
                [ChannelType.GuildStageVoice]: 'Stage Channel',
                [ChannelType.GuildForum]: 'Forum Channel',
                [ChannelType.PublicThread]: 'Public Thread',
                [ChannelType.PrivateThread]: 'Private Thread',
                [ChannelType.GuildDirectory]: 'Directory Channel',
            }[channel.type] || 'Unknown Type';

            const logContainer = new ContainerBuilder()
                .setAccentColor(0x00FF00)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`# 📢 Channel Created\n## New ${channelType} Added\n\n> Channel creation event detected\n> System logging active`)
                )
                .addSectionComponents(
                    new SectionBuilder()
                        .addTextDisplayComponents(
                            new TextDisplayBuilder()
                                .setContent(`**Channel Name**\n${channel.name}\n\n**Channel ID**\n\`${channel.id}\`\n\n**Channel Type**\n${channelType}\n\n**Category**\n${channel.parent ? channel.parent.name : 'No Category'}\n\n**Created At**\n<t:${Math.floor(channel.createdTimestamp / 1000)}:F>`)
                        )
                        .setThumbnailAccessory(
                            new ThumbnailBuilder()
                                .setURL(logHandlersIcons.staffIcon)
                                .setDescription(`Channel creation notification`)
                        )
                )
                .addSeparatorComponents(
                    new SeparatorBuilder()
                        .setSpacing(SeparatorSpacingSize.Small)
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`*Logs System • <t:${Math.floor(Date.now() / 1000)}:R>*`)
                );

            logChannel.send({
                components: [logContainer],
                flags: MessageFlags.IsComponentsV2
            });
        }
    });
};
