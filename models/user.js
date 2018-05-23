'use strict';
/**User数据库模型
 * @Author   LHK
 * @DateTime 2018-05-04
 * @version  [version]
 * @param    {[type]}   sequelize [description]
 * @param    {[type]}   DataTypes [description]
 * @return   {[type]}             [description]
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id:{type:DataTypes.BIGINT(11), autoIncrement:true, primaryKey : true, unique : true},
        username: { type: DataTypes.STRING,  allowNull: false, comment:'用户名' },
        password: { type: DataTypes.STRING, allowNull: false, comment:'用户密码' },
        active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, comment:'是否正常状态' }
    },
    {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci',
        getterMethods: {
            to_dict: function() {
                return {
                    id: this.id.toString(),
                    name: this.username
                }
            }
        }
    });
}