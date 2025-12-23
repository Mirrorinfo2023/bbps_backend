const { connect,baseurl } = require('../../config/db.config');
//const logger = require('../../logger/api.logger');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize');
//const helper = require('../utility/helper'); 
const pino = require('pino');
const logger = pino({ level: 'info' }, process.stdout);
const axios = require('axios');

const path = require('path');
require('dotenv').config();
// const baseUrl = process.env.API_BASE_URL;

class Banner {

    db = {};

    constructor() {
        this.db = connect();
        
    }
	
    async getBanner(req,res) {
	  
        try {
           
            let bannerCategories = await this.db.bannerCategory.getBannerCategory();
          
            let bannersByCategory = {};
          
            for (const category of bannerCategories) {
                const categoryId = category.id;
                const categoryName = category.category_name;
            
               
                let banners = await this.db.banner.getBanner(categoryId);
            
                bannersByCategory[categoryName] = banners.map((bannerItem) => ({
                    id: bannerItem.id,
                    title: bannerItem.title,
                    img: baseurl+bannerItem.img,
                    type_id: bannerItem.type_id,
                    banner_for: bannerItem.banner_for,
                  }));
              }
              
               const banner_data = Object.keys(bannersByCategory).reduce((result, categoryName) => {
                result[categoryName] = bannersByCategory[categoryName];
                return result;
              }, {});
              
              if (Object.keys(banner_data).length > 0) {
                return res.status(200).json({ status: 200, message: 'Banners Found', data: banner_data });
              } else {
                return res.status(401).json({ status: 401, token: '', message: 'Banners Not Found', data: [] });
              }
          }
        catch (err) {
                logger.error(`Unable to find Banner: ${err}`);
    			if (err.name === 'SequelizeValidationError') {
    			  const validationErrors = err.errors.map((err) => err.message);
    			  return res.status(500).json({ status: 500,errors: validationErrors });
    			}
    			 return res.status(500).json({ status: 500,token:'', message: err,data: []  });
            }
	
        }

}




module.exports = new Banner();