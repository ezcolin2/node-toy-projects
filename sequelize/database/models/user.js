export default (sequelize, DataTypes)=>{
    return sequelize.define(
        'User',
        {
            _id:{
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                comment: "auto increment PK"
            },
            name :{
                type: DataTypes.STRING,
                comment: "유저 이름"
            },
            age: {
                type: DataTypes.INTEGER,
                comment: "나이"
            }
        }
    )
}