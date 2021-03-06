const editors = [];
const validators = [];

module.exports = {

    editor: function (constructor) {
        console.log(`register editor ${constructor.name}`);
        editors.push(constructor);
    },

    validator: function (keyword, value, validator) {
        console.log(`register validator ${keyword}:${value}`);
        validators.push([keyword, value, validator]);
    },

    getEditors: () => editors,
    getValidators: () => validators
};
