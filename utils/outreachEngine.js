// Outreach Engine for Nexus TechHub
// Mock implementation for demo purposes

export const createCampaign = async (campaignData) => {
  console.log('Creating outreach campaign:', campaignData);

  return {
    success: true,
    campaign: {
      id: `campaign_${Date.now()}`,
      ...campaignData,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
};

export const getCampaign = async (campaignId) => {
  console.log(`Getting campaign ${campaignId}`);

  return {
    success: true,
    campaign: {
      id: campaignId,
      name: 'Sample Campaign',
      description: 'Demo outreach campaign',
      status: 'draft',
      channels: ['email', 'whatsapp'],
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:00:00.000Z'
    }
  };
};

export const updateCampaign = async (campaignId, updates) => {
  console.log(`Updating campaign ${campaignId}:`, updates);

  return {
    success: true,
    campaign: {
      id: campaignId,
      ...updates,
      updated_at: new Date().toISOString()
    }
  };
};

export const deleteCampaign = async (campaignId) => {
  console.log(`Deleting campaign ${campaignId}`);

  return {
    success: true,
    deleted: true
  };
};

export const getCampaigns = async (filters = {}) => {
  console.log('Getting campaigns with filters:', filters);

  return {
    success: true,
    campaigns: [
      {
        id: 'campaign_1',
        name: 'iPhone 15 Launch Campaign',
        description: 'Promote new iPhone 15 parts',
        status: 'active',
        channels: ['email', 'whatsapp'],
        created_at: '2024-01-15T10:00:00.000Z'
      },
      {
        id: 'campaign_2',
        name: 'Samsung Galaxy S24 Parts',
        description: 'New Samsung parts announcement',
        status: 'draft',
        channels: ['email'],
        created_at: '2024-01-10T09:00:00.000Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1
    }
  };
};

export const addRecipients = async (campaignId, recipients) => {
  console.log(`Adding recipients to campaign ${campaignId}:`, recipients);

  return {
    success: true,
    added: recipients.length,
    recipients: recipients.map((recipient, index) => ({
      id: `recipient_${Date.now()}_${index}`,
      ...recipient,
      campaign_id: campaignId,
      status: 'pending',
      added_at: new Date().toISOString()
    }))
  };
};

export const getRecipients = async (campaignId, pagination = {}) => {
  console.log(`Getting recipients for campaign ${campaignId}:`, pagination);

  return {
    success: true,
    recipients: [
      {
        id: 'recipient_1',
        email: 'customer1@example.com',
        name: 'John Doe',
        phone: '+971585531029',
        status: 'pending',
        campaign_id: campaignId
      },
      {
        id: 'recipient_2',
        email: 'customer2@example.com',
        name: 'Jane Smith',
        phone: '+971585531029',
        status: 'sent',
        campaign_id: campaignId
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 2,
      totalPages: 1
    }
  };
};

export const executeCampaign = async (campaignId) => {
  console.log(`Executing campaign ${campaignId}`);

  return {
    success: true,
    execution: {
      campaign_id: campaignId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 3600000).toISOString()
    }
  };
};

export const pauseCampaign = async (campaignId) => {
  console.log(`Pausing campaign ${campaignId}`);

  return {
    success: true,
    campaign: {
      id: campaignId,
      status: 'paused',
      paused_at: new Date().toISOString()
    }
  };
};

export const resumeCampaign = async (campaignId) => {
  console.log(`Resuming campaign ${campaignId}`);

  return {
    success: true,
    campaign: {
      id: campaignId,
      status: 'in_progress',
      resumed_at: new Date().toISOString()
    }
  };
};

export const stopCampaign = async (campaignId) => {
  console.log(`Stopping campaign ${campaignId}`);

  return {
    success: true,
    campaign: {
      id: campaignId,
      status: 'stopped',
      stopped_at: new Date().toISOString()
    }
  };
};

export const scheduleCampaign = async (campaignId, scheduleTime) => {
  console.log(`Scheduling campaign ${campaignId} for ${scheduleTime}`);

  return {
    success: true,
    campaign: {
      id: campaignId,
      status: 'scheduled',
      scheduled_at: scheduleTime,
      updated_at: new Date().toISOString()
    }
  };
};

export const executeCampaignNow = async (campaignId) => {
  console.log(`Executing campaign ${campaignId} immediately`);

  return {
    success: true,
    execution: {
      campaign_id: campaignId,
      status: 'executing',
      started_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 1800000).toISOString() // 30 minutes
    }
  };
};

export const addRecipientsToCampaign = async (campaignId, recipients) => {
  console.log(`Adding ${recipients.length} recipients to campaign ${campaignId}`);

  return {
    success: true,
    added: recipients.length,
    recipients: recipients.map((recipient, index) => ({
      id: `recipient_${Date.now()}_${index}`,
      ...recipient,
      campaign_id: campaignId,
      status: 'pending',
      added_at: new Date().toISOString()
    }))
  };
};

export default {
  createCampaign,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  addRecipients,
  getRecipients,
  executeCampaign,
  pauseCampaign,
  resumeCampaign,
  stopCampaign,
  scheduleCampaign,
  executeCampaignNow,
  addRecipientsToCampaign
};
