const { connect,baseurl } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
const utility = require('../../utility/utility'); 
const cuelinks = require('../../utility/cuelinks.utility'); 
const { paginate } = require('../../utility/pagination.utility'); 

class Cuelinks {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async get_campaigns(req,res) {

        const { page } = req
        const requiredKeys = ['page'];
         
        if ( !requiredKeys.every(key => key in req)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
        }
        
        try {
            const CampaignsData = await cuelinks.getCampaigns(page);
            
            
            if(CampaignsData)
            {
                const allCampaigns = CampaignsData.result.campaigns;

                for(const campaign of allCampaigns)
                {
                    const category = campaign.categories?campaign.categories[0]:null;
                    // const linksData = await cuelinks.getAffiliateLink(campaign.url);

                    const inputData = {
                        campaign_id: campaign.id,
                        name : campaign.name, 
                        url : campaign.url, 
                        domain : campaign.domain, 
                        payout_type : campaign.payout_type,
                        payout: campaign.payout,
                        image : campaign.image, 
                        additional_info : campaign.additional_info, 
                        important_info : campaign.important_info_html, 
                        last_modified : campaign.last_modified, 
                        payout_categories : JSON.stringify(campaign.payout_categories), 
                        category_id : category?category.id:null, 
                        category_name : category?category.name:null,
                        categories: JSON.stringify(campaign.categories),
                        countries : JSON.stringify(campaign.countries), 
                        reporting_type : campaign.reporting_type, 
                        deeplink_allowed : campaign.deeplink_allowed,
                        sub_ids_allowed : campaign.sub_ids_allowed,
                        cashback_publishers_allowed : campaign.cashback_publishers_allowed,
                        social_media_publishers_allowed : campaign.social_media_publishers_allowed,
                        missing_transactions_accepted : campaign.missing_transactions_accepted,
                        response_json : JSON.stringify(CampaignsData),
                        // affiliate_url: linksData.result.affiliate_url,
                        // shorten_url : linksData.result.shorten_url
                    }
                    if(await this.db.campagins.count({where: {campaign_id: campaign.id}})>0)
                    {
                        await this.db.campagins.updateData(inputData, {campaign_id:campaign.id});
                    }else{
                        await this.db.campagins.insertData(inputData);
                    }
                }

                const attributes = ['id',
                    `campaign_id`, 
                    `name`, 
                    `url`, 
                    `domain`,
                    `payout_type`, 
                    `payout`, 
                    `image`, 
                    `additional_info`, 
                    `important_info`, 
                    `last_modified`, 
                    `payout_categories`,
                    `category_id`, 
                    `category_name`, 
                    `reporting_type`, 
                    `deeplink_allowed`,
                    `status`,
                    'created_on',
                    `affiliate_url`
                ];
                const resData = await this.db.campagins.findAll({attributes: attributes, where: {status: 1}, order: [['id', 'desc']]});
                return res.status(200).json({ status: 200, message: 'campagins updated', data: resData });
            }else{
                return res.status(500).json({ status: 200, message: 'campagins api issues', data: [] });
            }
            
    
        } catch (err) {
                console.log(err);
                if (err.name === 'SequelizeValidationError') {
                
                return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                }
                return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
        }
    
    }


    async get_links(req,res) {

        const { url } = req;
        const requiredKeys = ['url'];
         
        if ( !requiredKeys.every(key => key in req)) {
            return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
        }

        try {

            const linksData = await cuelinks.getAffiliateLink(url);
            
            
            if(linksData)
            {
                const result = linksData.result;
                const inputData = {
                    affiliate_url: result.affiliate_url,
                    shorten_url : result.shorten_url
                }

                await this.db.campagins.updateData(inputData, {campaign_id:result.campaign_id});

                return res.status(200).json({ status: 200, message: 'Links updated', data: result });
            }else{
                return res.status(500).json({ status: 200, message: 'Links api issues', data: linksData });
            }
            
    
        } catch (err) {
                console.log(err);
                if (err.name === 'SequelizeValidationError') {
                
                return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
                }
                return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
        }
    
    }
    


    async get_Offers(req,res) {

        // const { url } = req;
        // const requiredKeys = ['url'];
         
        // if ( !requiredKeys.every(key => key in req)) {
        // return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
        // }

        try {

            const offersData = await cuelinks.getOffers();
            
            
            if(offersData)
            {
                const result = offersData.result;

                return res.status(200).json({ status: 200, message: 'Links updated', data: result });
            }else{
                return res.status(500).json({ status: 200, message: 'Links api issues', data: offersData });
            }
            
    
        } catch (err) {
            console.log(err);
            if (err.name === 'SequelizeValidationError') {
            
            return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
        }
    
    }


    async getMyCampagins(req,res) {

        try {
            const attributes = ['id',
                    `campaign_id`, 
                    `name`, 
                    `url`, 
                    `domain`,
                    `payout_type`, 
                    `payout`, 
                    `image`, 
                    `additional_info`, 
                    `important_info`, 
                    `last_modified`, 
                    `payout_categories`,
                    `category_id`, 
                    `category_name`, 
                    `reporting_type`, 
                    `deeplink_allowed`,
                    `status`,
                    'created_on',
                    `affiliate_url`
                ];
            const resData = await this.db.campagins.findAll({attributes: attributes, where: {status: 1}, order: [['id', 'desc']]});
            return res.status(200).json({ status: 200, message: 'campagins updated', data: resData });
            
    
        } catch (err) {
            console.log(err);
            if (err.name === 'SequelizeValidationError') {
            
            return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
            }
            return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
        }
    
    }


    // async updateCampagin(req,res) {

    //     const { campagin_id, url } = req;
    //     const requiredKeys = ['campagin_id'];
         
    //     if ( !requiredKeys.every(key => key in req)) {
    //     return res.status(400).json(utility.DataEncrypt(JSON.stringify({ status: 400, message: 'Required input data is missing' ,columns:requiredKeys})));
    //     }

    //     try {
    //         const getAffiliateLink = await this.db.affiliateLink.findOne({where: {'campagin_id': campagin_id}});

    //         if(getAffiliateLink)
    //         {
                
    //         }
            
    //          const offersData = await cuelinks.getOffers();
            
            
    //         if(offersData)
    //         {
    //             const result = offersData.result;
    //             // const inputData = {
    //             //     affiliate_url: result.affiliate_url,
    //             //     shorten_url : result.shorten_url
    //             // }

    //             // await this.db.campagins.updateData(inputData, {campaign_id:result.campaign_id});

    //             return res.status(200).json({ status: 200, message: 'Links updated', data: result });
    //         }else{
    //             return res.status(500).json({ status: 200, message: 'Links api issues', data: offersData });
    //         }
            
    
    //     } catch (err) {
    //             console.log(err);
    //             if (err.name === 'SequelizeValidationError') {
                
    //             return res.status(500).json({ status: 500,errors: 'Internal Server Error' });
    //             }
    //             return res.status(500).json({ status: 500,token:'', message: err.message,data: []  });
    //     }
    
    // }
    

}




module.exports = new Cuelinks();