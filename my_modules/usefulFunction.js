/**
 * Created by khk on 2016-02-18.
 */

module.exports = {
        fromSnakeToCamel : function fromSnakeToCamel (string){
            return string.replace(/(\_[a-z])/g, ($1) =>  $1.toUpperCase().replace('_',''));
        }
};

