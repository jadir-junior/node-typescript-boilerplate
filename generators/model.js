module.exports = function (plop) {
  plop.setGenerator('Model', {
    description: 'application model logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'model name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/models/{{name}}.model.ts',
        templateFile: 'templates/model.tsx.hbs',
      },
    ],
  });
};
