const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    // Basic Info
    reportId: {
        type: String,
        required: true,
        unique: true,
        default: () => `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    },
    guildId: {
        type: String,
        required: true,
        index: true
    },
    
    // Reporter & Reported User
    reportedUser: {
        userId: { type: String, required: true, index: true },
        username: { type: String, required: true },
        displayName: String,
        avatarURL: String,
        accountCreatedAt: Date,
        joinedServerAt: Date
    },
    
    reporter: {
        userId: { type: String, required: true, index: true },
        username: { type: String, required: true },
        displayName: String,
        avatarURL: String
    },
    
    // Report Details
    reason: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: [
            'spam',
            'harassment',
            'inappropriate_content',
            'hate_speech',
            'doxxing',
            'impersonation',
            'self_harm',
            'malicious_links',
            'raid_behavior',
            'other'
        ],
        required: true
    },
    
    // Context
    evidence: {
        messageId: String,
        messageContent: String,
        channelId: String,
        channelName: String,
        attachments: [String], // URLs to evidence files
        screenshots: [String]
    },
    
    // AI Analysis
    aiAnalysis: {
        analyzed: { type: Boolean, default: false },
        confidence: { type: Number, min: 0, max: 1 },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high', 'critical'],
            default: 'medium'
        },
        autoFlags: [String],
        reasoning: String,
        riskScore: { type: Number, min: 0, max: 100 },
        categories: [String],
        analyzedAt: Date
    },
    
    // Status & Management
    status: {
        type: String,
        enum: ['pending', 'under_review', 'resolved', 'dismissed', 'escalated'],
        default: 'pending',
        index: true
    },
    
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        index: true
    },
    
    // Moderator Actions
    assignedModerator: {
        userId: String,
        username: String,
        assignedAt: Date
    },
    
    moderatorNotes: [{
        moderatorId: String,
        moderatorName: String,
        note: String,
        timestamp: { type: Date, default: Date.now }
    }],
    
    resolution: {
        action: {
            type: String,
            enum: ['none', 'warning', 'timeout', 'kick', 'ban', 'role_removed', 'other']
        },
        details: String,
        resolvedBy: String,
        resolvedAt: Date
    },
    
    // Metadata
    timestamps: {
        createdAt: { type: Date, default: Date.now, index: true },
        updatedAt: { type: Date, default: Date.now },
        lastViewedAt: Date
    },
    
    // Related Reports
    relatedReports: [String], // Array of report IDs
    duplicateOf: String, // Report ID if this is a duplicate
    
    // Notifications
    notifications: {
        moderatorsSent: { type: Boolean, default: false },
        reporterNotified: { type: Boolean, default: false },
        escalationSent: { type: Boolean, default: false }
    }
}, {
    timestamps: { createdAt: 'timestamps.createdAt', updatedAt: 'timestamps.updatedAt' }
});

// Indexes for better performance
reportSchema.index({ guildId: 1, status: 1, priority: -1 });
reportSchema.index({ 'reportedUser.userId': 1, guildId: 1 });
reportSchema.index({ 'reporter.userId': 1, guildId: 1 });
reportSchema.index({ 'timestamps.createdAt': -1 });
reportSchema.index({ 'aiAnalysis.severity': 1, status: 1 });

module.exports = mongoose.model('Report', reportSchema);
