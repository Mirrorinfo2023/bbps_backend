const cuelinksModule = require('../config/cuelinks.config');
const axios = require('axios');
const crypto = require('crypto');
const culinksConfig = cuelinksModule.cuelinks();

function getCampaigns(sort_column=null, sort_direction=null, page=null, per_page=null, search_term=null, country_id=null, categories=null) {

    return new Promise((resolve, reject) => {
        let apiUrl = culinksConfig.getCampaignUrl;
        const apiKey = culinksConfig.apiKey;
        const queryParams = new URLSearchParams();

        if (sort_column !== null) queryParams.append('sort_column', sort_column);
        if (sort_direction !== null) queryParams.append('sort_direction', sort_direction);
        if (page !== null) queryParams.append('page', page);
        if (per_page !== null) queryParams.append('per_page', per_page);
        if (search_term !== null) queryParams.append('search_term', search_term);
        if (country_id !== null) queryParams.append('country_id', country_id);
        if (categories !== null) queryParams.append('categories', categories);

        const finalUrl = `${apiUrl}?${queryParams.toString()}`;
       
        
        axios.get(finalUrl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token token=${apiKey}`
                }
            }
            ) 
            .then((response) => {
                resolve({ result: response.data }); 
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}


function getAffiliateLink(url=null, channel_id=null, shorten=null) {

    return new Promise((resolve, reject) => {
        let apiUrl = culinksConfig.getLinkUrl;
        const apiKey = culinksConfig.apiKey;
        const queryParams = new URLSearchParams();

        if (url !== null) queryParams.append('url', url);
        if (channel_id !== null) queryParams.append('channel_id', channel_id);
        if (shorten !== null) queryParams.append('shorten', shorten);

        const finalUrl = `${apiUrl}?${queryParams.toString()}`;
       
        
        axios.get(finalUrl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token token=${apiKey}`
                }
            }
            ) 
            .then((response) => {
                resolve({ result: response.data }); 
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}



function getOffers(start_date=null, end_date=null, categories=null, campaigns=null, offer_types=null, page=null, per_page=null) {

    return new Promise((resolve, reject) => {
        let apiUrl = culinksConfig.getOfferUrl;
        const apiKey = culinksConfig.apiKey;
        const queryParams = new URLSearchParams();

        if (start_date !== null) queryParams.append('start_date', start_date);
        if (end_date !== null) queryParams.append('end_date', end_date);
        if (page !== null) queryParams.append('page', page);
        if (per_page !== null) queryParams.append('per_page', per_page);
        if (campaigns !== null) queryParams.append('campaigns', campaigns);
        if (offer_types !== null) queryParams.append('offer_types', offer_types);
        if (categories !== null) queryParams.append('categories', categories);

        const finalUrl = `${apiUrl}?${queryParams.toString()}`;
       
        
        axios.get(finalUrl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Token token=${apiKey}`
                }
            }
            ) 
            .then((response) => {
                resolve({ result: response.data }); 
                
            })
            .catch((error) => {
                console.log(error);
                reject(error); 
            });
            
    });

}





module.exports = {
    getCampaigns,
    getAffiliateLink,
    getOffers
};