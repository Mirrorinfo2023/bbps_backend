const cuelinks = () => {
    
    const obj = {};
    
    obj.apiKey   = "uu4fHkJjXOd-zKDTLXkwE4OsetMVLWuy1sx0AjPzCEc"; 
    obj.getCampaignUrl    = "https://www.cuelinks.com/api/v2/campaigns.json"; 
    obj.getCampaignCountUrl ="https://www.cuelinks.com/api/v2/campaigns/count.json";
    obj.getAllCampaignUrl = "https://www.cuelinks.com/api/v2/all_campaigns.json";
    obj.getAddCampaignUrl = "https://www.cuelinks.com/api/v2/campaign-approval";
    obj.getTransactionUrl = "https://www.cuelinks.com/api/v2/transactions.json";
    obj.getLinkUrl = "https://www.cuelinks.com/api/v2/links.json";
    obj.getOfferUrl = "https://www.cuelinks.com/api/v2/offers.json";

     
    return obj;

}

module.exports = {
    cuelinks
}