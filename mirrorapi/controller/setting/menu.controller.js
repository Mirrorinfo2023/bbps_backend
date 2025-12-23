const { connect,config } = require('../../config/db.config');
const { QueryTypes,Sequelize, Model, DataTypes,Op } = require('sequelize'); 
const utility = require('../../utility/utility'); 


class Menu {
  db = {};

  constructor() {
    this.db = connect();
  }

  async getMenu(req, res) {

    const { employee_id } = req;
    const requiredKeys = Object.keys({ employee_id });

    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }
    
    try {
        
        const getData = await this.db.menuMaster.getAllData({status: 1});
        const menuData = [];
        for(const menu of getData)
        {
            const parentMenu = await this.db.menuMaster.getData({status: 1, id:menu.parent_id});
            const permission = await this.db.menuPermission.getData({status: 1, employee_id: employee_id, menu_id:menu.id});
            menuData.push({
                'id': menu.id,
                'menu_name': menu.menu_name,
                'parent_id': menu.parent_id,
                'parent_menu': parentMenu?parentMenu.menu_name: '',
                'menu_url': menu.menu_url,
                'list': permission?permission._list:0,
                'insert': permission?permission._insert:0,
                'view': permission?permission._view:0,
                'update': permission?permission._update:0,
                'delete': permission?permission._delete:0,
            });
        }

        return res.status(200).json({ status: 200, message: '', data: menuData });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message, data:[]});
    }
  }


  async setMenuPermission(req, res) {

    const { employee_id, menu_id, action, check_status, page_url } = req;
    const requiredKeys = Object.keys({ employee_id, menu_id, action, check_status });
    
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }
    
    try {
        
        const _list = (action=='list')?check_status:null;
        const _insert = (action=='insert')?check_status:null;
        const _update = (action=='update')?check_status:null;
        const _view = (action=='view')?check_status:null;
        const _delete = (action=='delete')?check_status:null;
        
        const getData = await this.db.menuPermission.getData({employee_id, menu_id});
        if(getData)
        {
            
            const updateData = {};
            if(_list){ updateData._list = _list; }
            if(_insert){ updateData._insert = _insert; }
            if(_update){ updateData._update = _update; }
            if(_view){ updateData._view = _view; }
            if(_delete){ updateData._delete = _delete; }

            await this.db.menuPermission.update(updateData, {
                where: { employee_id: employee_id, menu_id: menu_id}
            });
        }else{
            const inputData = {
                'employee_id':employee_id,
                'menu_id':menu_id,
                'page_url':page_url,
                '_list':_list,
                '_insert': _insert,
                '_update': _update,
                '_view': _view,
                '_delete': _delete,
              }
                
              await this.db.menuPermission.insertData(inputData);
        }
        
        return res.status(200).json({ status: 200, message: 'Menu permission successfully', data:[] });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message, data:[]});
    }
  }

  async getEmployeemenuPermission(req, res) {

    const { employee_id } = req;
    const requiredKeys = Object.keys({ employee_id });
    
    if (!requiredKeys.every(key => key in req && req[key] !== '' && req[key] !== undefined)) {
        return res.status(400).json({ status: 400, message: 'Required input data is missing or empty', columns: requiredKeys });
    }
    
    try {

        const getAllData = await this.db.viewMenuPermission.getAllData({employee_id, status:1});

        return res.status(200).json({ status: 200, message: 'Menu found', data:getAllData });

    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const validationErrors = error.errors.map((err) => err.message);
          return res.status(500).json({ status: 500,errors: 'Internal Server Error', data:validationErrors });
        }
			
        return res.status(500).json({ status: 500,  message: error.message, data:[]});
    }
  }

}

module.exports = new Menu();